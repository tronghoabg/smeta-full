
import CryptoJS from 'crypto-js';

const getOrdercode = (email) => {
    const date = new Date()    
    const hashedEmail = CryptoJS.MD5(email, date).toString();
    // Chuyển chuỗi hex sang số nguyên  
    const numericValue = parseInt(hashedEmail, 16);
    const numericValueStr = numericValue.toString();
    const firstPart = numericValueStr.slice(0, 15); // Lấy 10 ký tự đầu tiên
    var randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return Number(( randomNumber + firstPart ).split('.').join(""))
}

export default getOrdercode