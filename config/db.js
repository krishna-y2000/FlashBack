const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path : './config.env'});
const connectMongo = async () => {
    try{
       await mongoose.connect( process.env.MONGOURI,{useNewUrlParser: true, useUnifiedTopology: true});
        console.log("DB connected");
    }
    catch(e)
    {
        console.log(e);
        throw e;
    }
}

module.exports = connectMongo;