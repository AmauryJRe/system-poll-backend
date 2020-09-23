var fs = require('fs');
var path = require('path');
var multer = require('multer');
const express = require('express');
const router = express.Router();
const UserProfileModel = require('../models/UserProfile');
const Logger = require('../models/Logger');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const { logger } = new Logger();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

var upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  const userProfiles = await UserProfileModel.find({}, { password: 0 });

  try {
    res.send(userProfiles);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id', async (req, res) => {
  const userProfile = await UserProfileModel.findById(req.params.id);

  try {
    res.send(userProfile);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    logger.info('Adding userprofile to the database: ' + req.body.username);
    let userProfile = new UserProfileModel(req.body);
    const avatarCachePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    sharp(avatarCachePath)
      .resize({ height: 100, width: 100 })
      .toFile(avatarCachePath)
      .then(() => {
        console.log('Image Resized');
      })
      .catch(() => {
        console.log('Got Error');
      });
    userProfile.avatar = {
      data: fs.readFileSync(avatarCachePath),
      contentType: req.file.mimetype,
    };
    await userProfile.save();

    fs.unlinkSync(avatarCachePath);
    logger.info('User profile stored succesfully');
    res.send(userProfile);
  } catch (err) {
    logger.error(err.message, err);
    res.status(500).send(err);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    //   TODO
    const userProfile = await UserProfileModel.findByIdAndDelete(req.params.id);
    if (!userProfile) res.status(404).send('No item found');
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/', upload.single('image'), async (req, res) => {
  logger.info('Updating User');
  try {
    let userProfile = req.body;
    logger.info('Updating User');
    const avatarCachePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const avatarCachePathRe = path.join(__dirname, '..', 'uploads', `Resized-${req.file.filename}`);
    sharp(avatarCachePath)
      .resize({ height: 100, width: 100 })
      .toFile(avatarCachePathRe)
      .then((res) => {
        console.log('Image Resized ' + res.byteLength);
      })
      .catch((err) => {
        console.log('Got Error' + err);
      });

    const image = fs.readFileSync(avatarCachePathRe);
    if (image) {
      userProfile.avatar = {
        data: image,
        contentType: req.file.mimetype,
      };
      console.log('Image length ' + image.byteLength / 1024);
    }
    fs.unlinkSync(avatarCachePathRe);
    fs.unlinkSync(avatarCachePath);

    userProfile = await UserProfileModel.findByIdAndUpdate(req.body.id, userProfile);

    await userProfile.save();
    res.send({});
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
