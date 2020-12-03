var mongoose = require('mongoose');
var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    createdOn: {
        type: Date,
        "default": Date.now
    },
    authorEmail: String,
    authorName: String,
    comments: {
        type: Object,
        "default": []
    }
});

mongoose.model('Blog', blogSchema);
