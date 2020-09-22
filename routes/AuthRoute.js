const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/UserProfile');
const path = require('path');
var multer = require('multer');
var fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

var upload = multer({ storage: storage });

router.post('/register', upload.single('file'), async (req, res) => {
  let { username, password, fullName } = req.body;
  if (!username || !password || !fullName) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }
  try {
    const user = await User.findOne({ username });
    if (user) throw Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (!salt || !hash)
      throw Error(
        'Something went wrong while Securing your Password please, contact with the IT Support',
      );

    const newUser = new User({
      password: hash,
      username,
      fullName,
    });
    const avatarCachePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    newUser.avatar = {
      data: fs.readFileSync(avatarCachePath),
      contentType: req.file.mimetype,
    };
    fs.unlinkSync(avatarCachePath);
    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   POST auth/login
 * @desc    Login user
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) throw Error('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error('Could not sign the token');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
module.exports = router;
