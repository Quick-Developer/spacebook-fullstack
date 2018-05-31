var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const SERVER_PORT = 8080;

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

/* var firstPost = new Post ({
  text: "hello world",
  comments: [{
    text: "hi there",
    user: "barak"
  }]
});

var secendPost = new Post({
  text: "hello world",
  comments: [{
    text: "Really cool",
    user: "bibi"
  }]
});
firstPost.save();
secendPost.save();*/


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/loadAllPosts', (request, response) => {
  Post.find({}).populate('text, comments').exec(function (error, posts) {
    if (error) {
      return console.error(error);
    } else {
      response.send(posts);
    }
  });
});

// 2) to handle adding a post
app.post('/addPost', (request, response) => {
  let postObj = new Post({
    text: request.body.text,
    comments: []
  })
 postObj.save();
  response.send(postObj);
});

// 3) to handle deleting a post
app.delete('/deletePost/:postId', (request, response) => {
  let postId = request.params.postId;
  Post.findByIdAndRemove(postId, (err, removedPost) => {
    if (err) {
      console.log(err);
    } else {
      response.send(removedPost);
    }
  });
});
// 4) to handle adding a comment to a post
app.post('/post/:postId/AddComment', (request, response) => {  
  let postId = request.params.postId;
  Post.findByIdAndUpdate(postId, { $push: { comments: request.body } }, { new: true }, (err, updatedPost) => {
    if (err) {
      console.log(err);
    } else {
      response.send(updatedPost);
    }
  });
});

// 5) to handle deleting a comment from a post
app.delete('/post/:postId/deleteComment/:commentId', (request, response) => {
  let postId = request.params.postId;
  let commentId = request.params.commentId;
  Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, { new: true }, (err, updatedComment) => {
    if (err) {
      console.log(err);
    } else {
      response.send(updatedComment);
    }
  });
});

  app.listen(SERVER_PORT, () => {
    console.log("Server started on port " + SERVER_PORT);
  });
