const express = require('express')
const path = require('path')
const bodyparser = require('body-parser')
const cheerio = require('cheerio')
const axios = require('axios')
const mongoose = require('mongoose')

const app = express()
var db = require("./models")

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})


// require('./routes/apiRoutes')(app)



app.get('/scrape', (req,res) => {
     axios.get('https://www.theguardian.com/us')
    .then (r => {
        const $ = cheerio.load(r.data)
        $('div.fc-item__header').each((i, elem) =>{
            var count = 5
            if(i < count){
                var result = {}

                result.title = $(elem).children('h3').children('a').children('span').children('span').text()
                result.link = $(elem).children('h3').children('a').attr('href')
                result.saved = false

                db.Article.create(result)
                    .then(r => console.log(r))
                    .catch(e => console.log(e))
                // artArray.push({
                //     title: $(elem).children('h3').children('a').children('span').children('span').text(),
                //     link: $(elem).children('h3').children('a').attr('href')
                // })
            }
        })
        // res.json(artArray)
        res.sendStatus(200)
    })
    .catch(e => console.log(e))
})

app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(article => res.json(article))
      .catch(e => res.json(e));
})
  
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(article => res.json(article))
      .catch(e => res.json(e))
  })
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


   

// $('div.fc-item__header').each((i, elem) =>{
//     if(i<5){
//         console.log($(elem).children('h3').children('a').children('span').children('span').text())
//         console.log($(elem).children('h3').children('a').attr('href'))
//         const articleItem = document.createElement('li')
//         articleItem.innerHTML = `
//         ${$(elem).children('h3').children('a').children('span').children('span').text()}
//         `
//         document.querySelector("#homeResults").appendChild(articleItem)

//     }
// })

const PORT = process.env.PORT ||3000
app.listen(3000, () => console.log (`listening on: http://localhost:${PORT}` ))