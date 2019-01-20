const request = require('request-promise-native');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

module.exports = function (cb) {
  let json = [];
  const url = 'https://www.goldenhomes.co.nz/plans';

  request({ url, rejectUnauthorized: false })
    .then((html) => {
        const $ = cheerio.load(html);
        $('.xsb-col.xsb-content').children().each(function() {
          const data = $(this);
          const title = data.find('.g-houseland-header').text().trim();

          if (title) {
            const thumbnailImage = data.find('.g-houselandframe-image').attr('style').match(/(?<=url\()(.*)(?=\);)/)[0];
            const link = `https://www.goldenhomes.co.nz/plans/${title.toLowerCase()}`;
            const bedrooms = data.children('span').eq(2).children('.spec-deet').text();
            const bathrooms = data.children('span').eq(3).children('.spec-deet').text();
            const garages = data.children('span').eq(4).children('.spec-deet').text();
            const floorArea = data.children('span').eq(1).children('.spec-deet').text();

            json.push({
              uuid: uuidv5(link, uuidv5.URL),
              companyTitle: 'Golden Homes',
              title,
              bedrooms: Number(bedrooms),
              bathrooms: Number(bathrooms),
              garages: Number(garages),
              floorArea: Number(floorArea),
              link,
              thumbnailImage: `https://www.goldenhomes.co.nz${thumbnailImage}`,
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
