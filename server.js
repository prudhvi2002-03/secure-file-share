const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());1

app.post('/send-email', upload.array('files'), async (req, res) => {
  const { to, message } = req.body;
  const files = req.files;

  // Configure your SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your app password
    }
  });

  // Prepare attachments
  const attachments = files.map(file => ({
    filename: file.originalname,
    path: file.path
  }));

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Cloud Fuze Secure File Share',
      text: message || 'You have received files via Cloud Fuze Secure File Share.',
      attachments
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});