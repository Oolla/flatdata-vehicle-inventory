const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync(__dirname + '/inventory.json', 'utf8'));
const dealer = JSON.parse(fs.readFileSync(__dirname + '/dealerInfo.json', 'utf8'));

console.log('dealer.length: ' + dealer.length);

let merged = [];

for (let i = 0; i < inventory.length; i++) {
  merged.push({
    ...inventory[i],
    ...dealer.find(item => item.dealer_code === inventory[i].dealer),
  });
}

let count = 1;
merged = merged.map(el => {
  el.id = count;
  el.packages = el.packages.split(',');
  count++;
  return el;
});

fs.writeFileSync('inventoryAndDealer.json', JSON.stringify(merged), 'utf8');
