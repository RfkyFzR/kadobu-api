const { v4: uuidv4 } = require('uuid');

function orderCodeGenerator(kode_produk){
    const uuid = uuidv4();

    // Menggunakan UUID sebagai seed untuk generator nomor acak
    const seed = parseInt(uuid.replace(/\D/g, '').substr(0, 10)); // Mengambil 8 digit pertama dari UUID dan mengonversi ke angka bulat
    const randomNumber = Math.floor(Math.random(seed) * 100000000); // Menghasilkan nomor acak dengan seed
  
    // Memastikan nomor memiliki panjang tepat 8 digit dengan padding nol di depan jika perlu
    const randomNumberString = randomNumber.toString().padStart(10, '0');
    const combine = "KDB";
    kode_produk = combine + randomNumberString;
    return (kode_produk);
}

module.exports = orderCodeGenerator;