const express = require('express');
const Webtask = require('webtask-tools');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
  const plansMap = req.body.reduce((acc, cur) => {
    if (!cur.uuid) return acc;
    acc[cur.uuid] = cur;
    return acc;
  }, {})
  req.webtaskContext.storage.get((error) => {
    if (error) return res.send(error);
    req.webtaskContext.storage.set(plansMap, (error) => {
      if (error) return res.send(error);
      res.sendStatus(200);
    });
  });
});

app.get('/', (req, res) => {
  req.webtaskContext.storage.get((error, data = {}) => {
    if (error) return res.send(error);
    return res.send(Object.values(data));
  });
});

app.patch('/', (req, res) => {
  res.sendStatus(200);
});

app.delete('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = Webtask.fromExpress(app);
