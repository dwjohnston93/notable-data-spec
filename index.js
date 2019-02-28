const puppeteer = require('puppeteer');
const SEARCH = require('./search-value'); 

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });  
  const page = await browser.newPage();

  await page.goto('https://data.gov');
  
  //fill input field with search value in search-value.js and run the search
  const SEARCH_BAR_SELECTOR = "#search-header"; 
  const SEARCH_BUTTON_SELECTOR = "body > header > div.header.banner.frontpage-search > div > form > div > span > button"
  await page.click(SEARCH_BAR_SELECTOR);
  await page.keyboard.type(SEARCH.searchValue);
  await page.click(SEARCH_BUTTON_SELECTOR);

  await page.waitFor(2*1000);

  //selectors for data set name, organization, and data formats
  const DATA_SET_NAME_SELECTOR = "#content > div.row.wrapper > div > section:nth-child(1) > div.module-content > ul > li:nth-child(INDEX) > div > h3"
  const ORGANIZATION_SELECTOR = "#content > div.row.wrapper > div > section:nth-child(1) > div.module-content > ul > li:nth-child(INDEX) > div > div.organization-type-wrap"
  const DATA_FORMATS_SELECTOR = "#content > div.row.wrapper > div > section:nth-child(1) > div.module-content > ul > li:nth-child(INDEX) > div > ul"

  //selector to determine how many entries per page 
  const LENGTH_SELECTOR_CLASS = "dataset-content";

  //get length of entries on page
  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, LENGTH_SELECTOR_CLASS);

  //loop through all entries on page and scrape data
  for (let i = 1; i<=listLength; i++){
    //change the index to the next child
    let dataNameSelector = DATA_SET_NAME_SELECTOR.replace("INDEX", i);
    let orgSelector = ORGANIZATION_SELECTOR.replace("INDEX", i);
    let formatSelector = DATA_FORMATS_SELECTOR.replace("INDEX", i); 

    let dataName = await page.evaluate((sel) => {
        let element = document.querySelector(sel).innerHTML
        return element ? element: null; 
    }, dataNameSelector); 

    console.log("dataName:", dataName);

    let org = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element ? element.innerHTML: null; 
    }, orgSelector); 

    let format = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element ? element.innerHTML: null; 
    }, formatSelector); 

    console.log(dataName, ' -> ', org, ' -> ', format); 
  }

    browser.close();
}

run();