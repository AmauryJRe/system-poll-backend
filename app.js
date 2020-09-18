require('dotenv').config();
const Logger = require('./models/Logger');
const { logger } = new Logger();
const express = require('express');
const mongoose = require('mongoose');

const pollRouter = require('./routes/PollRoutes');
const voteRouter = require('./routes/VoteRoutes');
const userProfileRoute = require('./routes/UserProfileRoutes');
const uris = process.env.URIS;
const methodOverride = require('method-override');

const app = express();
//For Dev porpuse
const getter = (req) => {
  if (req.body && typeof req.body === 'object' && 'method' in req.body) {
    logger.warn(`MiddleWare Method Override is running`);
    const method = req.body.method;
    delete req.body.method;
    return method;
  }
};
//For Dev porpuse

const fs = require('fs');
var path = require('path');

mongoose
  .connect(uris, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info('Connected to Database');
  })
  .catch((err) => {
    console.error(err);
  });

try {
  if (fs.existsSync('./uploads')) {
    logger.info('Directory exists.');
  } else {
    logger.info('Making directoy uploads');
    fs.mkdirSync(path.join(__dirname, 'uploads'));
    logger.info('Directoy uploads created');
  }
} catch (e) {
  console.log('An error occurred.');
}

const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => logger.info(`Server running in ${SERVER_PORT}`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride(getter));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/poll', pollRouter);
app.use('/vote', voteRouter);
app.use('/userprofile', userProfileRoute);
