const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer transporter (replace with your actual email service details)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'outlook', etc.
  auth: {
    user: 'your_email@example.com', // Your email address
    pass: 'your_email_password',   // Your email password or app-specific password
  },
});

router.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const mailOptions = {
      from: 'your_email@example.com', // Sender address
      to,                               // List of recipients
      subject,                          // Subject line
      text,                             // Plain text body
      html,                             // HTML body
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ msg: 'Failed to send email.', error: error.message });
  }
});

module.exports = router;
