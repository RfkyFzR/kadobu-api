const { v4: uuidv4 } = require("uuid");

function generateToken() {
  const uuid = uuidv4();

  // Menggunakan UUID sebagai seed untuk generator nomor acak
  const seed = parseInt(uuid.replace(/\D/g, "").substr(0, 16), 10); // Mengambil 16 digit pertama dari UUID dan mengonversi ke angka bulat
  const randomNumber = Math.floor(Math.random(seed) * 0xffffffffffff); // Menghasilkan nomor acak dengan seed

  // Memastikan nomor memiliki panjang tepat 8 digit dengan padding nol di depan jika perlu
  const token = randomNumber.toString(16).padStart(16, "0");

  return token;
}

module.exports = {
  generateToken,
};
