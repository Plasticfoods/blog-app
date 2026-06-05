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

// Add indexes for pagination and filtering performance
blogSchema.index({ uploadDate: -1 });  // For sorting by date
blogSchema.index({ category: 1 });      // For category filtering
blogSchema.index({ uploadDate: -1, _id: -1 });  // Compound index for efficient pagination

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;