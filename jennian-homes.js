const request = require('request-promise-native');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

module.exports = function (cb) {
  let json = [];
  const url = 'https://jennian.co.nz/all-house-plans-2/';

  request({ url, rejectUnauthorized: false })
    .then((html) => {
        const $ = cheerio.load(html);
        $('.loop-content.epl-shortcode-listing-category.epl-template-blog').children().each(function() {
          const data = $(this);
          const title = data.find('.item-street').text().trim();

          if (title) {
            const thumbnailImage = data.find('.teaser-left-thumb').attr('src');
            const link = data.find('a').eq(0).attr('href');
            const bedrooms = data.find('.property_bedrooms').children('.number').text();
            const bathrooms = data.find('.property_bathrooms').children('.number').text();
            const garages = data.find('.property_garage').children('.number').text();
            const floorArea = data.find('.property_land_area').text().split(' - ')[1].replace('m²', '').trim();

            json.push({
              uuid: uuidv5(link, uuidv5.URL),
              companyTitle: 'Jennian Homes',
              title,
              bedrooms: Number(bedrooms),
              bathrooms: Number(bathrooms),
              garages: Number(garages),
              floorArea: Number(floorArea),
              link,
              thumbnailImage,
              collectionTitle: null,
              price: null
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
