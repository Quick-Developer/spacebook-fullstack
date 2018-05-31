var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments


let commentSchema = new mongoose.Schema({
    text: String,
    user: String
});


let postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema]
});

let Post = mongoose.model('post', postSchema)

module.exports = Post
