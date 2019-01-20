const request = require('request-promise-native');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

module.exports = function (cb) {
  let json = [];
  const url = 'http://www.classicbuilders.co.nz/house-plans/';

  request({ url, rejectUnauthorized: false })
    .then((html) => {
        const $ = cheerio.load(html);
        $('.fitlerable-listing').children().each(function() {
          const data = $(this);
          const listingItem = data.data();
          const title = data.find('.item-description').children().eq(0).text().trim().split('  ')[0];
          const link = `http://www.classicbuilders.co.nz/house-plans/${title}`;
          const thumbnailImage = data.find('.foreground-image').attr('src');
          if (title) {
            json.push({
              uuid: uuidv5(link, uuidv5.URL),
              companyTitle: 'Classic Builders',
              title,
              bedrooms: Number(listingItem.bedrooms),
              bathrooms: Number(listingItem.bathrooms),
              garages: Number(listingItem.garages),
              floorArea: Number(listingItem.floorarea),
              link,
              thumbnailImage: `http://www.classicbuilders.co.nz${thumbnailImage}`,
              collectionTitle: listingItem.series,
              price: Number(listingItem.price)
            })
          }
      });
      return request({
        method: 'PATCH',
        uri: 'https://wt-douglasbamber-gmail_com-0.sandbox.auth0-extend.com/plans',
        body: json,
        json: true
      });
    }).then(() => {
      cb(null, json);
    })
    .catch((error) => {
      cb(error);
    });
}
