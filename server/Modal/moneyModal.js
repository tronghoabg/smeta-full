const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/smeta')

const moneySchema = mongoose.Schema({
     userId :{
        ref :'user'
    },
    key:{
        type:String
    },
    time :{
        type: Date
    },
    money:{
        type:Number,
    },
    thoihan:{
        type: Boolean
    }
},{collection:'money'})


const moneyModal = mongoose.model("money",moneySchema)
module.exports = moneyModal