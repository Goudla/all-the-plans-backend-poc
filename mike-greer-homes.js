const request = require('request-promise-native');
const cheerio = require('cheerio');

module.exports = function (cb) {
  const urls = [
    'https://www.mikegreerhomes.co.nz/design-and-build/entry',
    'https://www.mikegreerhomes.co.nz/design-and-build/transitional',
    'https://www.mikegreerhomes.co.nz/design-and-build/family'
  ];

  const requests = urls.map(function(url) {
    return request({ url, rejectUnauthorized: false });
  });

  Promise.all(requests)
    .then((values) => {
      const json = [];

      values.forEach(function(html) {
        const $ = cheerio.load(html);
        $('.packageset').children().each(function() {
          const data = $(this);
          const title = data.find('.main').children().text().trim();
          const bedrooms = data.find('.bedroom').text().trim();
          const bathrooms = data.find('.bathroom').text().trim();
          const garages = data.find('.garage').text().trim();
          const id = data.attr('id').replace('property_detail_', '');
          json.push({
            title,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            garages: Number(garages),
            id: Number(id)
          })
        });
      });
      cb(null, json);
    })
    .catch((error) => {
      cb(error);
    });
}
