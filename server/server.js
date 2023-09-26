const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('public')); 


app.use('/api/auth', authRouter);
app.use('/api/pass', password);
app.use('/api/payment', paymentRouter);
app.use('/api/buypackage', buypackageRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
