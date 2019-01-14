const express    = require('express');
const Webtask    = require('webtask-tools');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = Webtask.fromExpress(app);
