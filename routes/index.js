var express = require('express');
var router = express.Router();
var connectMongo = require("../config/db");
var uploadFiles = require('./uploadFiles.js');
var getFiles = require('./getFiles.js');
var insertBlog = require('./')
const PORT = process.env.PORT;
connectMongo();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("../views/HomePage.ejs",{title:"HomePage" , PORT: PORT});
});
router.use('/getfiles',getFiles);
router.use('/uploads',uploadFiles);
module.exports = router;