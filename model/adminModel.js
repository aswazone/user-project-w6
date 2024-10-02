const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

});
console.log('adminschema')

module.exports = mongoose.model('admin',adminSchema);