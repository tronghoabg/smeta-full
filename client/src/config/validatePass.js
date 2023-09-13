function validatePass(Pass) {
    // Sử dụng biểu thức chính quy để kiểm tra Pass
    const regex = /^[a-zA-Z0-9]{6,}$/;
  
    // Sử dụng test() để kiểm tra xem Pass có khớp với biểu thức chính quy hay không
    return regex.test(Pass);
  }

  export default validatePass