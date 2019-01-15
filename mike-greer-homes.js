const request = require('request-promise-native');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

module.exports = function (cb) {
  const collections = [
    {
      url: 'https://www.mikegreerhomes.co.nz/design-and-build/entry',
      title: 'Entry Collection'
    },
    {
      url: 'https://www.mikegreerhomes.co.nz/design-and-build/transitional',
      title: 'Transitional Collection'
    },
    {
      url: 'https://www.mikegreerhomes.co.nz/design-and-build/family',
      title: 'Family Collection'
    }
  ];

  const requests = collections.map(function(collection) {
    return request({ url: collection.url, rejectUnauthorized: false });
  });

  Promise.all(requests)
    .then((values) => {
      const json = [];
      values.forEach((html, index) => {
        const $ = cheerio.load(html);
        $('.packageset').children().each(function() {
          const data = $(this);
          const title = data.find('.main').children().text().trim();
          const bedrooms = data.find('.bedroom').text().trim();
          const bathrooms = data.find('.bathroom').text().trim();
          const garages = data.find('.garage').text().trim();
          const id = data.attr('id').replace('property_detail_', '');
          const link = `https://www.mikegreerhomes.co.nz/design-and-build/profile/${id}`;
          const thumbnailImage = data.find('.img-responsive').attr('src');
          const floorArea = data.find('.home-size').text().trim();

          json.push({
            uuid: uuidv5(link, uuidv5.URL),
            companyTitle: 'Mike Greer Homes',
            title,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            garages: Number(garages),
            floorArea: Number(floorArea),
            link,
            thumbnailImage: `https://www.mikegreerhomes.co.nz${thumbnailImage}`,
            collectionTitle: collections[index].title,
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
