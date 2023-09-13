const nodemailer = require('nodemailer');
const user = require('../Modal/userModal');
const crypto = require('crypto');
const bcrypt = require("bcrypt");

function generateAuthCode() {
  const buffer = crypto.randomBytes(4);
  return buffer.toString('hex').toUpperCase();
}
async function sendAuthCode(req, res) {
  const { email } = req.body;
  const code = generateAuthCode();
  const usercode = await user.updateOne({email:req.body.email},{code:code})
  const usernamecode = await user.findOne({username:req.body.username})

  if(usercode.modifiedCount=== 1 && usernamecode){
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'mon01092003@gmail.com', 
          pass: 'lhrbzxysxpbmqxob' 
        }
      });
      
      const mailOptions = {
        from: 'mon01092003@gmail.com',
        to: req.body.email, 
        subject: 'Mã xác thực',
        text: `Mã xác thực của bạn là: ${code}`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(401).json(error);
        } else {
           res.status(200).json(`Email sent: ' +${code}`) ;
        }
      });
  }else{
    let message = usercode.modifiedCount=== 1 ? 'Username không chính xác' : 'Email không tồn tại'
    res.status(401).json(message)
  }  
}

async function passwordretrieval(req, res) {
    const { email, code } = req.body;
    try {
      const users = await user.findOne({ email:req.body.email, code: req.body.code }); 
      if (!users) {
        return res.status(404).json({ error: 'Mã xác thực không chính xác' });
      }
      const data = await user.updateOne({email:req.body.email},{code:null})
      const bta = await user.findOne({email:req.body.email})
      const pass = bta.password
      // const passwordMatch = await bcrypt.compare(password,pass);
      res.status(200).json({ message: 'Thành công',pass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
    }
  }
  

  async function changePassword(req, res) {
    try {
      const { passwords, password_cu, password_change } = req.body;
      const userToUpdate = await user.findOne({ username: req.user.username });
      if (!userToUpdate) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      const passwordMatch = await bcrypt.compare(password_cu, userToUpdate.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Mật khẩu không đúng' });
      }
      if(passwords !== password_change){
        return res.status(401).json({ message: 'Mật khẩu không trùng khớp' });
      }else{
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(password_change, saltRounds);
    
        await user.findOneAndUpdate(
          { username: req.user.username },
          { password: newPasswordHash }
        );
    
        return res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }
  
  
module.exports = { sendAuthCode ,passwordretrieval,changePassword};
