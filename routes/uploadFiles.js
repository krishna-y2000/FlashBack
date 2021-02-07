const express = require("express") ;
const path = require("path") ;
const multer = require("multer") ;
const router = express.Router();
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage')
const MONGOURI = "mongodb+srv://dbKrishna:Kri75676@cluster0-9vtky.mongodb.net/uploaded-files?retryWrites=true&w=majority";
const promise = require('promise');
var crypto = require('crypto');
const Article = require("../config/model/article");
const article = require("../config/model/article");
const { update } = require("../config/model/article");
 // var conn = mongoose.connection;
 const conn = mongoose.createConnection(MONGOURI, {useNewUrlParser : true, useUnifiedTopology:true})
// mongoose.set({useUnifiedTopology: true, useNewUrlParser: true})
// const conn = await MongoClient.connect(MONGOURI , { useUnifiedTopology: true, useNewUrlParser: true, } );
mongoose.set('useCreateIndex',true);
let gfg;
conn.once("open",(err,res)=>{
    try{
 gfg = new mongoose.mongo.GridFSBucket(conn.db, {bucketName :"uploads" } )
    }
    catch(err)
    {
        res.json({
            err: message
        })
        console.log(err);
    }
} )



const storage = new GridFsStorage({
    url : MONGOURI,
    file : (req,file) => {
        return new promise((resolve,reject) => {
            crypto.randomBytes(16,(err,buf) => {
                if(err)
                {
                    console.log(err);
                    return reject(err)
                }
                const  filename = buf.toString('hex')  + path.extname(file.originalname);
                const fileDetails = {
                    filename : filename,
                    bucketName : "uploads"
                };
                resolve(fileDetails)
            } )
        } ) 
    } 
})

const upload = multer({storage});

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
            res.render('../views/upload.ejs', {files : false})
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
               

            return res.render('../views/upload.ejs', {
                files : checkFile,
                 titleHead : "Lets Upload Files"
              } )
        }
    } )
  
} );

router.post('/uploadedFiles',upload.single('file'), (req,res) => {
   res.redirect('/uploads');
} )


router.get('/image/:filename', (req,res) => {
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
     } )
router.post("/files/del/:id", (req, res) => {
        gfg.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
          if (err) return res.status(404).json({ err: err.message });
          res.redirect("/uploads");
        });
      });
 router.post("/files/download/:filename", (req, res) => {
 
        gfg.openDownloadStreamByName(req.params.filename).pipe(res);
 
      });
router.get('/articles',async (req,res) => {
    const articles = await Article.find().sort({createdAt : "desc"})
      res.render("../views/articles/getBlog.ejs", {articles : articles})
      })
router.get("/articles/new-article", (req,res) => {
    res.render("../views/articles/new-article.ejs", {article : new Article()} );
})

router.get('/clientarticles', async (req,res)=> {
    const allarticles = await Article.find().sort({createdAt : "desc"})
    res.render("../views/articles/clientarticles.ejs", {allarticles : allarticles})
})
router.post('/articleUploaded', async (req,res,next) => {
    req.article = new Article();
    next();
} , saveArticleAndRedirect('new-article') )

router.get('/article/:id' , async (req,res) => {
    console.log(req.params.id);
    const article = await Article.findOne({ _id : req.params.id } );
    if(article==null) res.redirect("/uploads/articles");
    res.render("../views/articles/show.ejs", {article : article})
})

router.put('/update/:id',async (req,res,next)=> {
    req.article = await Article.findById(req.params.id);
    next();
},saveArticleAndRedirect('new-article') )

router.get('/edit/:id',async (req,res) => {
    console.log(req.params.id);
    const article = await Article.findById(req.params.id)
     res.render('../views/articles/update.ejs', {article : article})

})

router.delete("/delete/:id", async(req,res) => {
    await Article.findByIdAndDelete(req.params.id);
     res.redirect("/uploads/articles");
})

router.get("/articles/delete",async (req,res) => {
    await Article.deleteMany({});
   return res.redirect('/uploads/articles');
})

function saveArticleAndRedirect(path){
    return async (req,res) => {
        let article = req.article
            article.title = req.body.title,
            article.description = req.body.description,
            article.markdown = req.body.markdown
        
        try 
        {
            article = await article.save();
            //console.log(article.id);
              return res.redirect(`/uploads/article/${article._id}`)
                  //next();
        }
        catch(err)
        {
            console.log(err);
            res.render(`../views/articles/${path}`, {article : article})
            
        }
    }
} 
module.exports = router;

// let article = new Article({
//     title : req.body.title,
//     description: req.body.description,
//     markdown : req.body.markdown
// })
// try 
// {
//     article = await article.save();
//     console.log(article.id);
//       return res.redirect(`/uploads/article/${article._id}`)
//           next();
// }
// catch(err)
// {
//     console.log(err);
//     res.send(err);
    
// }