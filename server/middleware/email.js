const { Verification_Email_Template } = require("../public/emailTemplate.js");
const { transporter } = require("./emailVerification.js");
const {dotenv} = require('dotenv');
require("dotenv").config();

// Function to send a verification email
const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: `"Basant Private Limited" <${process.env.authmail}>`, 
      to: email, 
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}`,
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
    });
    console.log(`Email sent successfully: ${response.messageId}`);
  } catch (error) {
    console.log("Error while sending email:", error.message);
  }
};

module.exports = { sendVerificationCode };
