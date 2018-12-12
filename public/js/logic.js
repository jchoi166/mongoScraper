
const scrapeArticles = () => {
    fetch('/scrape')
        .then(r => {
            console.log('scrape complete!')
            window.alert('Scrape Complete!')
            displayArticles()
        })
        .catch(e => console.log(e))
    
}
    
const displayArticles = () => {
    fetch("/articles")
            .then (r => r.json())
            .then (r => {
                r.forEach(article => {
                    const articleItem = document.createElement('div')
                    articleItem.className = 'item'
                    articleItem.innerHTML = `
                    <h6>Title: ${article.title} <button class="btn" style="float:right" data-id="${article._id}" onclick= "savePost()">Save Article</button></h6>
                    Link: ${article.link}
                    `
                    document.querySelector("#homeResults").appendChild(articleItem)
                    
                })
                })
                .catch(e => console.log(e))
}
    
