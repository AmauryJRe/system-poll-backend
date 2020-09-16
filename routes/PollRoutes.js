const express = require('express');
const { findById } = require('../models/Poll');
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
    const poll = new pollModel(req.body);

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
        if (!poll) res.status(404).send("No item found")
        res.status(200).send()
    } catch (err) {
        res.status(500).send(err)
    }
});

router.patch('/:id', async (req, res) => {
    try {
        await pollModel.findByIdAndUpdate(req.params.id, req.body)
        await pollModel.save()
        res.send(poll)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;