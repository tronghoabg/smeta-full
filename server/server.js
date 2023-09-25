const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRouter = require('./Router/auth');
const password = require('./Router/password');
const paymentRouter = require('./Router/payment');
const buypackageRouter = require('./Router/buyerpackage');
const adminRouter = require('./Router/admin');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
app.use(cors({ origin:'http://localhost:3000'}));
app.use(bodyParser.json());



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
const react = `/apps/server/client/build`;

app.use('/api/auth', authRouter);
app.use('/api/pass', password);
app.use('/api/payment', paymentRouter);
app.use('/api/buypackage', buypackageRouter);
app.use('/api/admin', adminRouter);
app.use(express.static(react));
io.on('connection', (socket) => {
    console.log('A client connected');
  
    // Gửi thông điệp cho máy khách khi kết nối thành công
    socket.emit('connected', 'Connected to the server!');
  
    // Lắng nghe thông điệp từ máy khách
    socket.on('clientMessage', (message) => {
      console.log('Received message from client:', message);
  
      // Gửi phản hồi lại máy khách
      socket.emit('serverMessage', 'Message received on the server: ' + message);
    });
  
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
  

app.get('*', (req, res) => {
  res.sendFile(`${react}/index.html`);
});

server.listen(5000, () => {
  console.log('Server is running');
});



//TEST REAL TIME
// server.listen(5000,()=>{
//     console.log("server is running")  
// })

module.exports = { io, server };
