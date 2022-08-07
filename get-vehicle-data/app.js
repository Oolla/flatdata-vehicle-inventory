const fs = require('fs');
const VendorRequests = require('./helpers/VendorRequests');

(async () => {
  try {
    const file = fs.readFileSync(__dirname + '/dealers.txt', 'utf8');
    let dealers = file.split(',');
    console.log(`dealers.length = ${dealers.length}`);

    let vendorRequests = new VendorRequests('Toyota');
    let locationData = await vendorRequests.getLocation(dealers);
    fs.writeFileSync('dealerInfo.json', JSON.stringify(locationData), 'utf8');
    console.log('Saved the dealer info.');
  } catch (err) {
    console.log('err', err);
    console.log(`err = ${err.message}`);
  }
})();
