const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/smeta')

const moneychitietSchema = mongoose.Schema({
     userId :{
        ref :'user'
    },
    time_start :{
        type: Date
    },
    time_end :{
        type: Date
    },
    money:{
        type:Number,
    }
},{collection:'moneychitiet'})


const moneychitietModal = mongoose.model("moneychitiet",moneychitietSchema)
module.exports = moneychitietModal