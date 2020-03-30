const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // create reusable TRANSPORTER object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // ***** Setup for using Gmail as a provider
    // service:'Gmail',
    // auth: {
    //     user: process.env.GMAIL_USERNAME,
    //     pass: process.env.GMAIL_PASSWORD
    //   }
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL_USERNAME,
      pass: process.env.SMTP_EMAIL_PASSWORD
    }
  });

  // Define the email OPTIONS
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message // plain text body
  };

  // Actually send the EMAIL
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
