const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/smeta')
const user = require("./userModal")
const paymentSchema = mongoose.Schema({
     userId :{
        type: String,
        ref :'user'
    },
    orderCode: {
        type: Number,
    },
    createdAt: {
        type: Date
    },
    amount:{
        type:Number,
    },
    status: {
        type: String
    },
    signature: {
        type:String
    }
   
},{collection:'payment'})


const paymentModal = mongoose.model("payment",paymentSchema)
module.exports = paymentModal
 



