const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/register');
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    const user = new User({ username, email, password: hashedPassword, otp, otpExpiry });
    await user.save();
    // Send OTP email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your OTP is: ${otp}`,
    });
    req.session.tempUserEmail = email;
    req.flash('success', 'Registration successful! Please check your email for the OTP.');
    res.redirect('/verify-otp');
  } catch (err) {
    req.flash('error', 'Registration failed. Try again.');
    res.redirect('/register');
  }
};

exports.getVerifyOTP = (req, res) => {
  res.render('verify-otp');
};

exports.postVerifyOTP = async (req, res) => {
  const { otp } = req.body;
  const email = req.session.tempUserEmail;
  if (!email) return res.redirect('/register');
  try {
    const user = await User.findOne({ email });
    if (!user) return res.redirect('/register');
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      req.flash('error', 'Invalid or expired OTP.');
      return res.redirect('/verify-otp');
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    req.session.tempUserEmail = null;
    req.flash('success', 'Email verified! You can now log in.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'OTP verification failed.');
    res.redirect('/verify-otp');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/login');
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/login');
    }
    if (!user.isVerified) {
      req.flash('error', 'Please verify your email first.');
      return res.redirect('/login');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/login');
    }
    req.session.userId = user._id;
    req.flash('success', 'Login successful!');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Login failed. Try again.');
    res.redirect('/login');
  }
};

exports.getDashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  res.render('dashboard', { user });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};