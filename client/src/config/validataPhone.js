function validatePhoneNumber(phoneNumber) {
    // Loại bỏ khoảng trắng và dấu gạch ngang (nếu có)
    const cleanedPhoneNumber = phoneNumber.replace(/\s|-/g, '');

    // Kiểm tra xem số điện thoại có chứa chữ số và có ít nhất 9 ký tự hay không
    return /^[0-9]{8,11}$/.test(cleanedPhoneNumber);
  }

  export default validatePhoneNumber