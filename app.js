const express = require("express");
const app = express();
const mongoose = require('mongoose');

const pollRouter = require('./routes/PollRoutes');
const voteRouter = require('./routes/VoteRoutes');

mongoose.connect('mongodb://localhost:27017/system-poll', {
    useNewUrlParser: true
}).then(res => {
    console.log('Connected to Database');
}).catch(err => {
    console.error(err);
});

const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => console.log(`Server running in ${SERVER_PORT}`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/poll',pollRouter);
app.use('/vote',voteRouter);