const request = require('request-promise-native');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

module.exports = function (cb) {
  let json = [];
  const url = 'https://www.gjgardner.co.nz/english/home-designs/';

  request({ url })
    .then((html) => {
      const $ = cheerio.load(html);
      const str = $('script:not([src])')[4].children[0].data;
      // HACK
      const listings = JSON.parse(str.match(/(?<=window.gjgardner.listings = )(.*)(?=;)/)[0]);
      json = listings.map(function(listing) {
        const link = `https://www.gjgardner.co.nz${listing.Link}`;
        return {
          uuid: uuidv5(link, uuidv5.URL),
          companyTitle: 'GJ Gardner',
          title: listing.Title,
          bedrooms: listing.Bedrooms,
          bathrooms: listing.Bathrooms,
          garages: listing.Garages,
          livingAreas: listing.LivingAreas,
          storeys: listing.Storeys,
          floorArea: listing.FloorArea,
          porchArea: listing.PorchArea,
          totalArea: listing.TotalArea,
          carportArea: listing.CarportArea,
          patioArea: listing.PatioArea,
          width: listing.Width,
          length: listing.Length,
          alfrescoArea: listing.AlfrescoArea,
          id: listing.ID,
          link,
          thumbnailImage: listing.ThumbnailImage,
          collectionTitle: listing.CollectionTitle,
          price: listing.Price
        }
      })
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
