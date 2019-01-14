const request = require('request');
const cheerio = require('cheerio');
const uuidv5 = require('uuid/v5');

const company = 'GJ Gardner';

module.exports = function (cb) {
  const url = 'https://www.gjgardner.co.nz/english/home-designs/';

  request({ url }, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const str = $('script:not([src])')[4].children[0].data;
      // HACK
      const listings = JSON.parse(str.match(/(?<=window.gjgardner.listings = )(.*)(?=;)/)[0]);
      const formattedListings = listings.map(function(listing) {
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
      cb(null, formattedListings);
    } else {
      cb(error);
    }
  })
}
