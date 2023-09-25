const dateFormat =(dateString)=>{
// Chuyển đổi chuỗi thành đối tượng Date
const dateObject = new Date(dateString);

// Lấy giờ, phút, giây từ đối tượng Date
const hours = dateObject.getHours();
const minutes = dateObject.getMinutes();
const seconds = dateObject.getSeconds();

// Lấy ngày, tháng, năm từ đối tượng Date
const day = dateObject.getDate();
const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0 nên cộng thêm 1
const year = dateObject.getFullYear();

// Định dạng lại thành chuỗi theo định dạng mong muốn
return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}
export default dateFormat