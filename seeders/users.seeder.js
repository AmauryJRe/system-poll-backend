require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Logger = require('../models/Logger');
const UserProfileModel = require('../models/UserProfile');
const { logger } = new Logger();
const uris = process.env.URIS;

mongoose
  .connect(uris, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(async () => {
    let seed = { fullName: 'Administrator', username: 'admin', role: 'role' };
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin', salt);
    seed.password = hash;
    logger.info('Connected to the Database');
    let userProfile = new UserProfileModel(seed);
    logger.info('Saving the object to Database');
    await userProfile.save();
    logger.info('Object saved!');
  })
  .catch((err) => {
    if (err.message.indexOf('duplicate % key')) {
      logger.warn('Duplicated key, object admin already exist on the database');
      process.exit();
    } else {
      logger.error('Erro seeding the database', err);
    }
  });
