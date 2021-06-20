var express = require('express');
var router = express.Router();
var connectMongo = require("../config/db");
var uploadFiles = require('./uploadFiles.js');
var getFiles = require('./getFiles.js');
var insertBlog = require('./');
const auth = require('../middleware/auth');
const PORT = process.env.PORT;
const Blog = require('../config/model/article');
connectMongo();
/* GET home page. */
router.get('/' ,auth , async function(req, res) { 
  Blog.find({})
    .sort({ createdAt : "desc" })
    .exec( (err,foundBlogs) => {
        if(err ) console.log(err);
        else
        {
          res.render("../views/HomePage.ejs" ,
           { title : "Home Page" ,
            posts: foundBlogs,
            isAuthenticated : req.user ? true : false  } )

        }
    } )
});
router.use('/getfiles',getFiles);
router.use('/uploads',uploadFiles);             
module.exports = router;                      
