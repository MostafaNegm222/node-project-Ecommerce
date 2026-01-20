const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_MAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = (email,sub,text="",html="") => {
  const info =  transporter.sendMail({
    from: process.env.EMAIL_MAIL,
    to: email,
    subject: sub,
    text: text, 
    html: html, 
  });
  console.log("Message sent:", info.messageId);
  return info
};