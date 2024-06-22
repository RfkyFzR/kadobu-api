const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'zachary.braun40@ethereal.email',
    pass: '6mTfrskpBMCK6727Wj',
  },
});

// async..await is not allowed in global scope, must use a wrapper
router.post('/', async function (req, res) {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.elasticemail.com', // SMTP server address (usually mail.your-domain.com)
      port: 465, // Port for SMTP (usually 465)
      secure: true, // Usually true if connecting to port 465
      auth: {
        user: 'kadobu2024@gmail.com', // Your email address
        pass: 'FC147A4FD2638FD9E526CBE1908BFA8F51CF', // Password (for gmail, your app password)
        // ⚠️ For better security, use environment variables set on the server for these values when deploying
      },
    });

    // Define and send message inside transporter.sendEmail() and await info about send from promise:
    let info = await transporter.sendMail({
      from: '"Kadobu" <kadobu2024@gmail.com>',
      to: 'ramanoorrizki@gmail.com',
      subject: 'Testing, testing, 123',
      html: `
    <h1>Hello there</h1>
    <p>Isn't NodeMailer useful?</p>
    `,
    });
    return res.status(200).json({
      succes: true,
      info,
    });
  } catch (error) {
    return res.status(400).json({
      succes: false,
      error: error.message,
    });
  }
});
// send mail with defined transport object

module.exports = router;
