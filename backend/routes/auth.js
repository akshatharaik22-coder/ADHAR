const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const otpStore = {}; // temporary OTP storage

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { aadhaar } = req.body;

    if (!aadhaar || aadhaar.length !== 12)
      return res.status(400).json({ message: 'Invalid Aadhaar number' });

    const [rows] = await db.query(
      'SELECT * FROM voters WHERE aadhaar_number = ?', [aadhaar]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Voter not found. Please register first.' });

    if (rows[0].has_voted)
      return res.status(403).json({ message: 'You have already voted.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[aadhaar] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: rows[0].email,
      subject: 'AadhaarVoteGuard - Your OTP',
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 5 minutes. Do not share.</p>`,
    });

    const maskedEmail = rows[0].email.replace(/(.{2}).+(@.+)/, '$1***$2');
    res.json({ message: `OTP sent to ${maskedEmail}` });

  // Change this in auth.js send-otp route
} catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message }); // ← change 'Server error' to err.message
}
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { aadhaar, otp } = req.body;
    const record = otpStore[aadhaar];

    if (!record)
      return res.status(401).json({ message: 'OTP not requested or expired' });

    if (record.otp !== otp)
      return res.status(401).json({ message: 'Incorrect OTP' });

    if (Date.now() > record.expiresAt) {
      delete otpStore[aadhaar];
      return res.status(401).json({ message: 'OTP has expired' });
    }

    delete otpStore[aadhaar]; // one-time use

    const token = jwt.sign(
      { aadhaar },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ message: 'OTP verified successfully', token });

 // Change this in auth.js send-otp route
} catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message }); // ← change 'Server error' to err.message
}
});

module.exports = router;