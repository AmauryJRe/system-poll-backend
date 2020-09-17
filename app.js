require('dotenv').config()
const Logger = require('./models/Logger');
const { logger } = new Logger();
const express = require("express");
const app = express();
const mongoose = require('mongoose');

const pollRouter = require('./routes/PollRoutes');
const userProfileRoute  = require('./routes/UserProfileRoutes')

const uris = process.env.uris

mongoose.connect(uris, {
    useNewUrlParser: true
}).then(res => {
    logger.info('Connected to Database')
}).catch(err => {
    console.error(err);
});

const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => logger.info(`Server running in ${SERVER_PORT}`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/poll', pollRouter);
app.use('/userprofile',userProfileRoute);