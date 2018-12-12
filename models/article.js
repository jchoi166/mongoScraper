var mongoose = require ('mongoose')

var Schema = mongoose.Schema

const ArticleSchema = new Schema ({
    title: String,
    link: String,
    saved: Boolean,
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article