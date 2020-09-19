const express = require('express');
const pollModel = require('../models/Poll');
const router = express.Router();

router.get('/', async (req, res) => {
  const polls = await pollModel.find({});

  try {
    res.send(polls);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id', async (req, res) => {
  const poll = await pollModel.findById(req.params.id);

  try {
    res.send(poll);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  const poll = new pollModel({ name: req.body.name, options: JSON.parse(req.body.options) });

  try {
    await poll.save();
    res.send(poll);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const poll = await pollModel.findByIdAndDelete(req.params.id);
    if (!poll) res.status(404).send('No item found');
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    await pollModel.findByIdAndUpdate(req.params.id, req.body);
    await pollModel.save();
    res.send({});
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
