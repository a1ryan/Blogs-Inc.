var express = require("express"),
methodOverride = require("method-override"),
sanitizer = require("express-sanitizer"), //this hits differently in 2020
app = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/blogs_inc");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE  
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error");
        }else{
            res.render("index", {blogs: blogs});
        }
    })
});

//NEW ROUTES
app.get("/blogs/new", function(req, res){
    res.render("new");
})

//CREATE ROUTES
app.post("/blogs", function(req, res){
    //sanitizing the input so that the user doesn't enter any code that can crash our site
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog:foundBlog});
        }
    })
    
})

//UPDATE ROUTES
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    //Blog.findByIdAndUpdate(id, newData, callback);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //delete blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
})

app.listen(3000 , function(){
    console.log("server is running");
})