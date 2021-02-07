const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { type } = require("os");

router.get('/newEmail',(req,res) => {
    res.render('emailMessage')
} )

router.post("/sendEmail" ,async (req,res) => {

    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "krishnay.75676@gmail.com",
            pass : "rajyadav75676"
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
         content: fs.createReadStream('/home/krishnaraj/Desktop/ME-Original (copy)/SRSF.txt')
      },
        {
            path : '/home/krishnaraj/Desktop/ME-Original (copy)/SRSF.txt'
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