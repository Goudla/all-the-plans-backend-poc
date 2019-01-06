const request = require('request@2.81.0');
const cheerio = require('cheerio@0.19.0');
// const request = require('request');
// const cheerio = require('cheerio');

module.exports = function (cb) {
  const jar = request.jar();
  const url = 'https://www.gjgardner.co.nz/english/home-designs/?listingsPerPage=16';

  request({ url, jar }, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const str = $('script:not([src])')[4].children[0].data;
      // HACK
      const listings = JSON.parse(str.match(/(?<=window.gjgardner.listings = )(.*)(?=;)/)[0]);
      cb(null, listings);
    } else {
      cb(error);
    }
  })
}
