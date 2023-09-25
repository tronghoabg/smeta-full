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



const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
 const io =  socketIo(server, {
        cors:{
            origin: "http://localhost:3000",
            methods: ["GET", "POST",]
        }
      });

app.use(function(req, res, next){
    res.io = io;
    next();
});
// const http = require("http");
// const { Server } = require("socket.io");
// const realtime = require('./socket/socket')
// const server = http.createServer(app)
// const io = new Server(server, {
//     cors:{
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST",]
//     }
//   });

//  module.exports = realtime(io, "")


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
server.listen(5000,()=>{
    console.log("server is running")  
})

module.exports = { io, server };
