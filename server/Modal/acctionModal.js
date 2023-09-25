const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/smeta')


const acctionSchema = mongoose.Schema({
   name: {
      type: String
   },
   acction: {
      type: String
   },
   ip: {
      type: String
   },
   language: {
      type: String,
   },
   date: {
      type: Date
   }

}, { collection: 'acction' })


const acctionModal = mongoose.model("acction", acctionSchema)
module.exports = acctionModal