const dns = require("dns").promises;
const validator = require("validator");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

exports.verifyEmail = async (email) => {
  if (!validator.isEmail(email)) {
    return { success: false, message: "Invalid email format." };
  }

  const domain = email.split("@")[1];

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { success: false, message: "Email domain is unreachable." };
    }
    return {
      success: true,
      message: "Email is valid and domain is reachable.",
    };
  } catch (error) {
    return { success: false, message: "Domain lookup failed." };
  }
};

exports.sendMail = async (email, subject, message) => {
  const mailOptions = {
    from: `"App Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `<p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    //console.log('Email sent: ', info.response);
    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email.', error: error.message };
  }
};
