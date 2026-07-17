require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.sendinblue.com';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER || 'apikey';
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_TO = process.env.MAIL_TO || 'krishivolt@gmail.com';

if (!SMTP_PASS) {
  console.error('Missing SMTP_PASS environment variable. Set it in .env before starting the server.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));

app.post('/send-mail', async (req, res) => {
  const { first_name, last_name, email, phone, message } = req.body;
  const fullName = [first_name, last_name].filter(Boolean).join(' ').trim();
  const html = `
    <h2>New Contact Request from Krishivolt</h2>
    <p><strong>Name:</strong> ${fullName || 'N/A'}</p>
    <p><strong>Email:</strong> ${email || 'N/A'}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${message ? message.replace(/\n/g, '<br>') : 'No message provided.'}</p>
  `;

  try {
    await transporter.sendMail({
      from: `Krishivolt Website <no-reply@krishivolt.com>`,
      to: MAIL_TO,
      replyTo: email || MAIL_TO,
      subject: `New contact request from ${fullName || 'website visitor'}`,
      text: `Name: ${fullName}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message || 'No message provided.'}`,
      html,
    });

    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Unable to send mail right now.' });
  }
});

app.listen(PORT, () => {
  console.log(`Krishivolt contact backend running at http://localhost:${PORT}`);
});
