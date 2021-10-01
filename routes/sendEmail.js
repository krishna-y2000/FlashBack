const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { type } = require("os");
const auth = require('../middleware/auth' );
const dotenv = require("dotenv");
dotenv.config({path : './config.env'});
router.get('/newEmail',auth , (req,res) => {
    res.render('emailMessage' ,  { isAuthenticated :req.user ? true : false } ) ;
} )

router.post("/sendEmail" ,async (req,res) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "krishnay.75676@gmail.com",
            pass : process.env.PASSWORD
        },
        tls : {
            rejectUnauthorized : false
        }
        
    } )
    console.log(req.body.paramessage);
    var mailOptions = {
      from: 'krishnay.75676@gmail.com',
      to: 'kyadav75676@gmail.com',
      subject: 'Sending Email via Node.js',
      text: req.body.paramessage ,
      attachments : [ {
        filename: 'mytext.txt',
         content: fs.createReadStream('/home/krishna2000/Study/Web/Vishesh/SRSF.txt')
      },
        {
            path : '/home/krishna2000/Study/Web/Vishesh/SRSF.txt'
        }
      ]
    }
    
    
 let info =  await transporter.sendMail(mailOptions , (error , response )=> {
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log('Email sent: ' + response)
            return res.redirect('/');

        }
    } );
    
    
} )
module.exports = router;