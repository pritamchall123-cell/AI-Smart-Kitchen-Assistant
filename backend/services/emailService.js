// services/emailService.js
// Reusable email-sending service using Nodemailer + Gmail.

const nodemailer = require("nodemailer");

// A "transporter" is Nodemailer's term for the connection that actually sends emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable function — takes recipient, subject, and HTML content
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"AI Smart Kitchen Assistant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

module.exports = sendEmail;