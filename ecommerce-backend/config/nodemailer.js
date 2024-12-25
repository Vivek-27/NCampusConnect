const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'Gmail', // Use your preferred email service
  port: 587,
  secure: true,
  auth: {
    user: 'vivekvbgm@gmail.com', // Your email  process.env.EMAIL_USER
    pass: 'usrw gomf zlkz hgqz' // Your email password or app password
  }
});

module.exports = transporter;
