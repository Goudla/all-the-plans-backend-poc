const request = require('request-promise-native');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

module.exports = function (cb) {
  let json = [];
  const collections = [
    {
      url: 'https://www.signature.co.nz/building-new/design-and-build/showcase',
      title: 'Design & Build'
    },
    {
      url: 'https://www.signature.co.nz/building-new/aspiring/products',
      title: 'Aspiring Collection'
    },
    {
      url: 'https://www.signature.co.nz/building-new/pre-designed-plan/products',
      title: 'Pacific Collection'
    },
    {
      url: 'https://www.signature.co.nz/building-new/smart-home-collection/products',
      title: 'Smart Collection'
    }
  ];

  const requests = collections.map(function(collection) {
    return request({ url: collection.url, rejectUnauthorized: false });
  });

  Promise.all(requests)
    .then((values) => {
      values.forEach((html, index) => {
        const $ = cheerio.load(html);
        $('.view-content.container').children().each(function() {
          const data = $(this);
          const title = data.find('a').eq(1).text().trim();
          if (title) {
            const bedrooms = data.find('.details').children().eq(1).text().trim();
            const bathrooms = data.find('.details').children().eq(2).text().trim();
            const garages = data.find('.details').children().eq(3).text().trim();
            const link = `https://www.signature.co.nz${data.find('a').eq(0).attr('href')}`;
            const thumbnailImage = data.find('a').eq(0).children().attr('src');
            const floorArea = data.find('a').eq(1).parent().text().split('|').slice(-1)[0].replace('m2', '').trim();

            json.push({
              uuid: uuidv5(link, uuidv5.URL),
              companyTitle: 'Signature Homes',
              title,
              bedrooms: Number(bedrooms),
              bathrooms: Number(bathrooms),
              garages: Number(garages),
              floorArea: Number(floorArea),
              link,
              thumbnailImage,
              collectionTitle: collections[index].title,
              price: null
            });
          }
        });
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
