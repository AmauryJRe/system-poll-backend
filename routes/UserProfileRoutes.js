var fs = require('fs');
var path = require('path');
var multer = require('multer');
const express = require('express');
const router = express.Router();
const UserProfileModel = require('../models/UserProfile');
const Logger = require('../models/Logger');
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
  const userProfiles = await UserProfileModel.find({}, { password: 0, avatar: 0 });

  try {
    res.send({ profiles: userProfiles });
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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    logger.info('Adding userprofile to the database: ' + req.body.username);
    let userProfile = new UserProfileModel(req.body);
    const avatarCachePath = path.join(__dirname, '..', 'uploads', req.file.filename);
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

router.delete('/:id', async (req, res) => {
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
    const image = fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename));
    if (image) {
      logger.warn(image.byteLength + 'Length ');
      userProfile.avatar = {
        data: image,
        contentType: req.file.mimetype,
      };
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', req.file.filename))
    }

    await UserProfileModel.findByIdAndUpdate(req.body.id, userProfile);

    await UserProfileModel.save();
    res.send({});
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
