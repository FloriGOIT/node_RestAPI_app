const nodemailer = require("nodemailer");


const nodemailerConfig = {
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);
const sendEmailOptions = (email, link) => {
const emailOptions = {
  from: process.env.OUTLOOK_EMAIL,
  to: email,
  subject: "Email confirmation",
  html: 
  `<html>
  <body>
    <h1>Please confirm your account</h1>
    <h3>In order to confirm your email account, please click on the link below:</h3>
    <br>
    <a href="${link}" style="text-decoration: none;">
      <button style="
        background-color: yellow; 
        color: green; 
        font-weight: bold; 
        border: none; 
        padding: 10px 20px; 
        font-size: 16px;
        cursor: pointer;">
        Confirm!
      </button>
    </a>
  </body>
</html>`,
};
return transporter.sendMail(emailOptions);
}

module.exports = sendEmailOptions;
