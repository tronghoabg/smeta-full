const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/smeta')

const buyerPackage = mongoose.Schema({
     userId :{
        type: String,
        ref :'user'
    },
    time_start :{
        type: Date
    },
    time_end :{
        type: Date
    },
    key: {
        type: String,
    },
    price:{
        type:Number,
    }
},{collection:'buyerPackage'})


const buyerPackageModal = mongoose.model("buyerPackage",buyerPackage)
module.exports = buyerPackageModal