function validateUsername(username) {
    // Sử dụng biểu thức chính quy để kiểm tra username
    const regex = /^[a-zA-Z0-9]{3,}$/;
  
    // Sử dụng test() để kiểm tra xem username có khớp với biểu thức chính quy hay không
    return regex.test(username);
  }

  export default validateUsername