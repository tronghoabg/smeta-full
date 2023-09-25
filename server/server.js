var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
const path = require('path');
const authRouter = require('./Router/auth')
const password = require('./Router/password')
const paymentRouter = require('./Router/payment')
const buypackageRouter = require('./Router/buyerpackage')
const adminRouter = require('./Router/admin')
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser');
dotenv.config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(bodyParser.json())

app.use(cookieParser());

const react = `/apps/server/client/build`
app.use(express.static(react));

app.use("/api/auth",authRouter)  
app.use("/api/pass",password)  

app.use('/', express.static(path.join(__dirname, 'public')));
app.use("/api/payment",paymentRouter)  
app.use("/api/buypackage",buypackageRouter)  
app.use("/api/admin",adminRouter) 
app.use(express.static(react));

app.get('*', (req, res) => {
    res.sendFile(`${react}/index.html`);
}); 

//TEST REAL TIME
app.listen(5000,()=>{
    console.log("server is running")  
})