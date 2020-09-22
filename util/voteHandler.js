const voteRegistry = require('../models/VoteRegistry');
const pollModel = require('../models/Poll');
const Logger = require('../models/Logger');
const { logger } = new Logger();

const makeVote = async (req, res, poll) => {
  try {
    const vote = new voteRegistry(req.body);
    await vote.save();
    poll.options[`${req.body.item_voted}`] += 1;
    poll = await pollModel.findByIdAndUpdate(req.body.poll_id, poll);
    await poll.save();
    res.status(200).json({ message: 'User has voted', code: 200 });
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateVote = async (req, res, poll, vote_id) => {
  try {
    let vote = req.body;
    vote.canVote = false;

    const voteBefore = await voteRegistry.findById(vote_id);
    const itemBefore = voteBefore.item_voted;

    poll.options[`${req.body.item_voted}`] += 1;
    if (poll.options[itemBefore]) {
      poll.options[itemBefore] -= 1;
      logger.info(`The item ${itemBefore} exists and it is about to be decreased by one`);
    }

    vote = await voteRegistry.findByIdAndUpdate(vote_id, vote);
    poll = await pollModel.findByIdAndUpdate(vote.poll_id, poll);
    await vote.save();
    await poll.save();
    res.status(200).json({ message: 'User has voted', code: 200 });
  } catch (err) {
    res.status(500).send(err);
  }
};

const resetVotesForPoll = async (req, res, poll_id) => {
  logger.warn(poll_id);
  let votes = await voteRegistry.find({ poll_id: poll_id });
  votes.forEach((vote) => {
    vote.canVote = true;
    vote.save();
  });
  logger.info(`All the users can vote in the poll with id '${poll_id}' again`);
};

const getAllPollWhereUserCantVote = async (req, res, user_id) => {
  const pollsWhereUserCantVote = await voteRegistry
    .find({ user_id: user_id, canVote: false })
    .select({ poll_id: 1, _id: 0 });
  let array = [];
  pollsWhereUserCantVote.forEach((res) => {
    array.push(res.poll_id);
  });
  res.send(array);
};

module.exports = {
  makeVote,
  updateVote,
  resetVotesForPoll,
  getAllPollWhereUserCantVote,
};
