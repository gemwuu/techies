const puppeteer = require('puppeteer');
const fs = require('fs');

const prodConfig = require('../config/config.prod.json');
let localConfig = {};
let index = 0;

try {
  localConfig = require('../config/config.local.json');
} catch (e) {
  console.warn('config.local.json file not found, use config.prod.json instead');
}

const jsonData = require(localConfig.jsonData || prodConfig.jsonData);

const DATA_PREFIX = '[reportData]';

const MOCK_DATA_PATH = localConfig.mockDataPath || prodConfig.mockDataPath;
const PRODUCTS = require(localConfig.sampleData || prodConfig.sampleData);

function genRandomFloat(precision) {
  return `${+new Date() % 2 ? '+' : '-'}` + Math.random().toFixed(precision);
}

function modifyData() {
  let shares = 0;
  const holdingProducts = PRODUCTS.slice(0, +new Date() % 3 + 1).map(item => {
    const share = Math.random().toFixed(4);
    item.share = share;
    shares += share * 1;
    return item;
  });

  if (Math.random() <= 0.05) {
    shares += 0.0010;
    console.info('error data: ', shares, index);
  }
  jsonData.totalShare = shares;
  jsonData.prevDailyProfit = genRandomFloat(2);
  jsonData.holdingProfit = genRandomFloat(2);
  jsonData.totalProfit = genRandomFloat(2);
  jsonData.holdingProducts = holdingProducts;

  fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(jsonData) + '\n', err => {
    if (err) throw err;
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
          index++;
          fs.appendFile(localConfig.filename || prodConfig.filename, value, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });

  setInterval(() => {
  // setTimeout(() => {
    modifyData();
    page.reload();
  }, 5000);
});
