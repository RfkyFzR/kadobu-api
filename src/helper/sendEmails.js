const nodemailer = require('nodemailer');

function sendEmails(emailPenjual, usernamePembeli, namaProduk){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "makhluksaranjana@gmail.com",
            pass: process.env.AUTH_KEY_MESSAGE,
        },
    });

    let info = transporter.sendMail({
        from: `"makhluksaranjana" <makhluksaranjana@gmail.com>`,
        to: emailPenjual,
        subject: "Kamu punya pesanan baru!",
        html: `
        <h1> Pesanan Baru Untukmu </h1>
        <p1> ${usernamePembeli} baru saja melakukan order produk ${namaProduk} </p1>
        `,
    });

    // console.log(info.messageId);
}

module.exports = {
    sendEmails,
}