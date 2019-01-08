const request = require('request');
const cheerio = require('cheerio');

module.exports = function (cb) {
  const url = 'http://www.classicbuilders.co.nz/house-plans/';

  request({ url }, function (error, response, html) {
    if (!error) {
      console.log('html', html);
      cb(null, []);
    } else {
      cb(error);
    }
  })
}
