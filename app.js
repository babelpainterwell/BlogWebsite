//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const findHelper = require(__dirname + "/lookUp.js");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

// -------------------------------------  Database Setup  ------------------------------------------------

// add delete function

// connect mongoose database 
mongoose.connect("mongodb+srv://zhongwez:1234567zzw@cluster0.nzznv2e.mongodb.net/postsDB");
mongoose.set('strictQuery', true);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: String
});

const Post = new mongoose.model("Post", postSchema);


// --------------------------------------------------------------------------------------------------------

// ***
// app.get("/",(req, res)=>{
//   res.render("home", {startingContent: homeStartingContent, posts: posts});
// })

app.get("/", (req, res)=>{
  Post.find({}, (err, foundPosts)=>{
    if (err) {
      console.log(err);
    }
    else {
      res.render("home", {startingContent: homeStartingContent, posts: foundPosts});
    }
  })

});



app.get("/about",(req, res)=>{
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact",(req, res)=>{
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", (req, res)=>{
  res.render("compose");
})

// ***
app.get("/posts/:postName",(req, res)=>{

  const requestedTitle =  _.lowerCase(req.params.postName);

  Post.find({}, (err, foundPosts)=>{
    if (err) {
      console.log(err);
    }
    else {
      foundPosts.forEach(eachPostFound=>{
        const storedTitle = _.lowerCase(eachPostFound.title);
        if (storedTitle === requestedTitle){
          res.render("post",{post: eachPostFound});
        }
      })
    }
  })
});

//   posts.forEach(post => {
//     const storedTitle = _.lowerCase(post.title);
//     if (storedTitle === requestedTitle){
//       res.render("post",{post: post});
//     }
//   })
// })

// ***
app.post("/compose", (req, res)=>{

  const newPost = new Post({
    title: req.body.postTitle,
    body: req.body.postContent
  })

  newPost.save((err)=>{
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  })

  // const post = {
  //   title: req.body.postTitle,
  //   body: req.body.postContent
  // }
  // posts.push(post);
  // res.redirect("/");
})

app.post("/delete", (req, res)=>{
  const deletedPostId = req.body.checkbox;
  Post.findByIdAndRemove(deletedPostId, (err)=>{
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});





  // const index = findHelper.find(req.params.postName, posts);

  // if (index != -1) {
  //   console.log("Match Found!");
  //   res.render('post', {post: posts[index]})
  // }
  // else {
  //   console.log("Post is not found!");
  //   res.render("failure");
  // }