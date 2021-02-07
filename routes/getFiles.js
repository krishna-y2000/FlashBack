const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage')
const promise = require('promise');
const multer = require("multer") ;
const MONGOURI = "mongodb+srv://dbKrishna:Kri75676@cluster0-9vtky.mongodb.net/uploaded-files?retryWrites=true&w=majority";
const conn = mongoose.createConnection(MONGOURI, {useNewUrlParser : true, useUnifiedTopology:true})
let gfg ;
 conn.once('open', (err,res) => {
    try{
    gfg = new mongoose.mongo.GridFSBucket(conn.db ,{ bucketName : "uploads"})
    }
    catch(err)
    {
        res.json({                                                                                                                                           
            err: message
        })
        console.log(err);
    }

} )
router.get('/',(req,res) => {
    
    // res.render("../views/upload", {titleHead : "Lets Upload Files"} );
 
     if(!gfg)
     {
         res.send("Error occured to connect to DB")
         process.exit(0);
     }
     gfg.find().toArray((err,files) => {
         if(!files || files.length === 0 )
         {
             res.render('/home/krishnaraj/Desktop/ME-2 (copy)/views/getFiles.ejs', {files : false})
         }
         else
         {
             const checkFile = files
                 .map(file => {
                 if(file.contentType === 'image/png' || file.contentType === "image/jpeg" )
                 {
                     file.isImage = true
                 }
                 else
                 {
                     file.isImage = false
                 }
                 return file
                 } )
                
 
             return res.render('/home/krishnaraj/Desktop/ME-2 (copy)/views/getFiles.ejs', {
                 files : checkFile,
                  titleHead : "Lets Get Files"
               } )
         }
     } )
   
 } );
 multer();
router.get('/:filename', (req,res) => {
    const file = gfg.find({filename : req.params.filename} )
                    .toArray((err,files) => {
                        if(!files || files.length === 0 )
                        {
                          return res.status(404).json({
                                err : "No such file exist"
                            }).send("file does not exist");
                        }
                        gfg.openDownloadStreamByName(req.params.filename).pipe(res);
            } )
})

router.post("/files/download/:filename", (req, res) => {
 
    gfg.openDownloadStreamByName(req.params.filename).pipe(res);

  });
module.exports = router;
