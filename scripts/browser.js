const puppeteer = require('puppeteer');
const fs = require('fs');

const prodConfig = require('../config/config.prod.json');
let localConfig = {};

try {
  localConfig = require('../config/config.local.json');
} catch (e) {
  console.warn('config.local.json file not found, use config.prod.json instead');
}

const jsonData = require(localConfig.jsonData || prodConfig.jsonData);

const DATA_PREFIX = '[reportData]';

const MOCK_DATA_PATH = localConfig.mockDataPath || prodConfig.mockDataPath;
const PRODUCTS = require(localConfig.sampleData || prodConfig.sampleData);

function modifyData() {
  let shares = 0;
  const prevDailyProfit = `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(2);
  const holdingProfit = `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(2);
  const totalProfit = `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(2);
  const holdingProducts = PRODUCTS.slice(0, +new Date() % 3 + 1).map(item => {
    const share = Math.random().toFixed(4);
    item.share = share;
    shares += share * 1;
    return item;
  });

  if (Math.random() <= 0.1) {
    console.info('error data');
    shares += 0.0010;
  }
  jsonData.totalShare = shares;
  jsonData.prevDailyProfit = `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(2);
  jsonData.holdingProfit = `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(2);
  jsonData.totalProfit = `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(2);
  jsonData.holdingProducts = holdingProducts;

  fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(jsonData) + '\n', err => {
    if (err) throw err;

    console.info('update data');
  });
}


puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto(localConfig.pageLink || prodConfig.pageLink);
  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      msg.args()[i].jsonValue().then(value => {
        if (value.startsWith(DATA_PREFIX)) {
          value = value.replace(/^\[reportData\]/, '') + '\n';
          fs.appendFile(localConfig.filename || prodConfig.filename, value, (err) => {
            if (err) throw err;
            console.log('done!');
          });
        }
      });
    }
  });

  setInterval(() => {
    modifyData();
    page.reload();
  }, 5000);
});
