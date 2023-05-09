function generateRandomCode() {
    // Tạo số ngẫu nhiên từ 0 đến 999999
    const randomNum = Math.floor(Math.random() * 1000000);
    // Chuyển số thành chuỗi và thêm '0' vào đầu chuỗi nếu số chữ số ít hơn 6
    const code = String(randomNum).padStart(6, '0');
    return code;
  }
  module.exports = {
    generateRandomCode,
    };