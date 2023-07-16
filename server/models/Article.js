const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String
    },
    name: {
        type: String        
    },
    imageUrl: {
        type: String
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        default: 'Sports'
    }
})

const Article = mongoose.model("article", articleSchema);

module.exports = Article;