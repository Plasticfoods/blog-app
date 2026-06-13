const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
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
        default: 'Other'
    }
})

// Compound index for efficient pagination with newest-first sort
blogSchema.index({ uploadDate: -1, _id: -1 });

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;