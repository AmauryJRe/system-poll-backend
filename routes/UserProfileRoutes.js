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
// FIXME
router.get('/', async (req, res) => {
  const userProfiles = await UserProfileModel.find({});

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
    logger.info('Adding userprofile to the database: ' + req.body.name);
    let userProfile = new UserProfileModel(req.body);
    const avatarCachePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    userProfile.avatar = {
      data: fs.readFileSync(avatarCachePath),
      contentType: 'image/png',
    };
    await userProfile.save();
    // FIXME See if this is onvenient in the future
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

router.patch('/:id', async (req, res) => {
  try {
    await UserProfileModel.findByIdAndUpdate(req.params.id, req.body);
    // TODO. Add cod for proper image update
    await UserProfileModel.save();
    res.send({});
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
