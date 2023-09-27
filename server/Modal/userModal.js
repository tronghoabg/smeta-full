const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/smeta')

const getDefaultThoiGian = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1000); 
    return currentDate;
};


const userSchema = mongoose.Schema({
    username:{
        type: String,
        required:true,
        minlength:6,
        maxlength:20,
        unique:true,
    },
    password:{
        type: String,
        required:true,
        minlength:6,
    },
    role : {
        type: String,
        default : 'user'
    },
    email : {
        type:String
    },
    refreshToken:{
        type:String,
        default: null
    },
    code: {
        type:String,
        default:null
    },
    userLanguage:{
        type:String,
    },
    phone :{
        type:String
    },
    totleMoney:{
        type:Number,
        default:0
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    action :{
        type:[],
        default: [{
            key: "share pixel",
            time_end: getDefaultThoiGian()
        }]
    },
    usedMonney: {
        type: Number,
        default: 0
    }
},{collection:'user'})
// await userModal.collection.dropIndexes();
// await userModal.createIndexes();


userSchema.index({ '$**': 'text' });

const userModal = mongoose.model("user",userSchema)


module.exports = userModal