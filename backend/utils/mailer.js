const nodemailer = require('nodemailer');

// Configure nodemailer transporter (replace with your actual email service details)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'outlook', etc.
  auth: {
    user: 'your_email@example.com', // Your email address
    pass: 'your_email_password',   // Your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: 'your_email@example.com', // Sender address
      to,                               // List of recipients
      subject,                          // Subject line
      text,                             // Plain text body
      html,                             // HTML body
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Failed to send email to:', to, error);
  }
};

module.exports = { sendEmail };
