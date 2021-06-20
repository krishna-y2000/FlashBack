const mongoose = require("mongoose");
const marked = require("marked");
//const slugify = require("slugify");;
//var slug = require('mongoose-slug-generator');
//mongoose.plugin(slug);
const articleSchema = mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true,
        minlength : 1
    },
    createdAt: {
        type : Date,
        default : Date.now()
    }
   
})

// articleSchema.pre('validate ', function(next) {
//     if(this.title)
//     {
//         this.slug = slugify(this.title , { lower : true })
//         console.log(this.slug);
//     }
//     next();
// } )

module.exports = mongoose.model('Article', articleSchema);