const request = require('request');
const cheerio = require('cheerio');

module.exports = function (cb) {
  const jar = request.jar();
  const url = 'https://www.gjgardner.co.nz/english/home-designs/?listingsPerPage=16';

  request({ url, jar }, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const str = $('script:not([src])')[4].children[0].data;
      // HACK
      const listings = JSON.parse(str.match(/(?<=window.gjgardner.listings = )(.*)(?=;)/)[0]);
      // "Title": "Stafford",
      // "Bedrooms": "5",
      // "Bathrooms": "4",
      // "Garages": "4",
      // "LivingAreas": "3",
      // "Storeys": "1",
      // "FloorArea": "484.1",
      // "PorchArea": "5.60",
      // "TotalArea": "489.70",
      // "CarportArea": "0.00",
      // "PatioArea": "0.00",
      // "Width": "22.30",
      // "Length": "41.00",
      // "AlfrescoArea": "0.00",
      // "ID": 236,
      // "Link": "/english/home-designs/stafford/",
      // "ThumbnailImage": "https://www.gjgardner.co.nz/assets/Uploads/home-design/thumbnail/Estate-Stafford-HouseDesign-Render-Thumbnail.jpg",
      // "CollectionTitle": "Estate Collection",
      // "Price": 746467.7777777778,
      cb(null, listings);
    } else {
      cb(error);
    }
  })
}
