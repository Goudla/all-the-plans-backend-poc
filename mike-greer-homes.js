const request = require('request');
const cheerio = require('cheerio');

module.exports = function (cb) {
  const urls = [
    'https://www.mikegreerhomes.co.nz/design-and-build/entry',
    'https://www.mikegreerhomes.co.nz/design-and-build/transitional',
    'https://www.mikegreerhomes.co.nz/design-and-build/family'
  ];
  const url = 'https://www.mikegreerhomes.co.nz/design-and-build/entry';

  request({ url, rejectUnauthorized: false }, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const json = [];
      $('.packageset').children().each(function(i, elem) {
        const data = $(this);
        const title = data.find('.main').children().text().trim();
        const bedrooms = data.find('.bedroom').text().trim();
        const bathrooms = data.find('.bathroom').text().trim();
        const garages = data.find('.garage').text().trim();
        const id = data.attr('id').replace('property_detail_', '');
        json[i - 1] = {
          title,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          garages: Number(garages),
          id: Number(id)
        }
      });
      cb(null, json);
    } else {
      cb(error);
    }
  })
}
