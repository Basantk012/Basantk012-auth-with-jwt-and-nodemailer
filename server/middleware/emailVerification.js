const nodemailer = require("nodemailer");
const {dotenv} = require('dotenv');
require("dotenv").config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.authmail, 
    pass: process.env.authpass, 
  },
});



// Export the transporter
module.exports = { transporter };
