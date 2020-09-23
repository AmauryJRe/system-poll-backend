const express = require('express');
const pollModel = require('../models/Poll');
const router = express.Router();
const { success, error } = require('../util/responseApi');
const Logger = require('../models/Logger');
const auth = require('../middleware/auth');
const { logger } = new Logger();

router.get('/', async (req, res) => {
  const polls = await pollModel.find({});
  try {
    res.send(polls);
  } catch (err) {
    res.status(500).json(error('Internal Server Error', res.statusCode));
  }
});

router.get('/:id', async (req, res) => {
  const poll = await pollModel.findById(req.params.id);

  try {
    res.send(poll);
  } catch (err) {
    res.status(500).json(error('Internal Server Error', res.statusCode));
  }
});

router.post('/',auth, async (req, res) => {
  const poll = new pollModel({ name: req.body.name, options: JSON.parse(req.body.options) });

  try {
    await poll.save();
    res.status(200).json(success('OK', { data: 'Poll added' }, res.statusCode));
  } catch (err) {
    res.status(500).json(error('Internal Server Error', res.statusCode));
  }
});

router.delete('/:id',auth, async (req, res) => {
  try {
    const poll = await pollModel.findByIdAndDelete(req.params.id);
    if (!poll) res.status(404).send('No item found');
    res.status(200).json(success('OK', { data: 'Poll Deleted' }, res.statusCode));
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/:id',auth, async (req, res) => {
  try {
    const poll = { name: req.body.name, options: JSON.parse(req.body.options) };
    poll.edited = true;
    const response = await pollModel.findByIdAndUpdate(req.params.id, poll);
    await response.save();
    res.status(200).json(success('OK', { data: 'Poll Edited' }, res.statusCode));
  } catch (err) {
    res.status(500).json(error('Internal Server Error', res.statusCode));
  }
});

module.exports = router;
