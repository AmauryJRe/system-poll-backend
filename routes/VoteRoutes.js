const express = require('express');
const voteRegistry = require('../models/VoteRegistry');
const pollModel = require('../models/Poll');
const router = express.Router();
const Logger = require('../models/Logger');
const { updateVote, makeVote, resetVotesForPoll } = require('../util/voteHandler');
const { logger } = new Logger();

router.post('/', async (req, res) => {
  const poll = await pollModel.findById(req.body.poll_id);
  const vote = await voteRegistry.find({ user_id: req.body.user_id, poll_id: req.body.poll_id });
  if (vote.length > 0 && vote[0].canVote) {
    logger.info(`The user: ${'user'} can vote again, the option canVote is true`);
    updateVote(req, res, poll, vote[0].id);
  }
  if (vote.length === 0) {
    logger.info(`The user: ${'user'} has no vote yet, so he/she can vote`);
    makeVote(req, res, poll);
  }

  if (vote.length > 0 && !vote[0].canVote) {
    console.log(`The user: ${'user'} can\'t vote again`);
    res.status(403).json({ message: "This User can't vote again", code: 403, error: true });
  }
});

router.get('/', async (req, res, next) => {
  resetVotesForPoll(req, res, req.body.poll_id);
  next();
});

module.exports = router;