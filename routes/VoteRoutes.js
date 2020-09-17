const express = require('express');
const voteRegistry = require('../models/VoteRegistry');
const pollModel = require('../models/Poll');
const router = express.Router();

router.post('/', async (req, res) => {
    const poll = await pollModel.findById(req.body.poll_id);
    const vote = await voteRegistry.find({ user_id: req.body.user_id, poll_id: req.body.poll_id, })
    if (vote.length > 0 && vote[0].canVote) {
        console.log('This User can vote again, the flag is true');
        updateVote(req, res, poll, vote[0].id);
    }
    if (vote.length === 0) {
        console.log('This User can vote again');
        makeVote(req, res, poll);
    }

    if (vote.length > 0 && !vote[0].canVote) {
        console.log('This User can\'t vote again');
        res.status(403).json({ message: "This User can\'t vote again", code: 403, error: true });
    }
});

const makeVote = async (req, res, poll) => {
    try {
        const vote = new voteRegistry(req.body);
        await vote.save();
        poll.options[`${req.body.item_voted}`] += 1;
        await pollModel.findByIdAndUpdate(req.body.poll_id, poll);
        await pollModel.save();
        res.status(200).json({ message: 'User has voted', code: 200 });
    } catch (err) {
        res.status(500).send(err);
    }
}

const updateVote = async (req, res, poll, vote_id) => {
    try {
        vote = req.body;
        vote.canVote=false
        const voteBefore = await voteRegistry.findById(vote_id);
        const itemBefore = voteBefore.item_voted;
        poll.options[`${req.body.item_voted}`] += 1;
        if(poll.options[itemBefore]){
            poll.options[itemBefore]-=1;
        }
        await voteRegistry.findByIdAndUpdate(vote_id,vote);
        await pollModel.findByIdAndUpdate(vote.poll_id, poll);
        await vote.save();
        await pollModel.save();
        res.status(200).json({ message: 'User has voted', code: 200 });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = router;