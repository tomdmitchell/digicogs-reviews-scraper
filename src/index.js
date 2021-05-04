import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import dotenv from 'dotenv';
dotenv.config();

import writeJson from './writeJson.js';
import createDataObj from './createDataObj.js';
import getPuppeteerPage from './getPuppeteerPage.js';
import getNumberOfReviews from './getNumberOfReviews.js';
import getReleaseIds from './getReleaseIds.js';
import counterWrapper from './counterWrapper.js';

const init = async () => {
  //INIT COUNTER
  let counter = counterWrapper();
  let fileIndex = 1;
  //LAUNCH BROWSER
  const browser = await puppeteer.launch();
  try {
    const page = await getPuppeteerPage(browser);
    const releaseIds = await getReleaseIds(process.env.GENRE, process.env.STYLE);
    let dataArr = [];
    //BEGIN ITERATION
    for (let i = 0; i < releaseIds.length; i++) {
      const reviewsUrl = `https://www.discogs.com/release/${releaseIds[i]}/reviews`;
      console.log(`URL ${i + 1} of ${releaseIds.length + 1}: ${reviewsUrl}`);
      await page.goto(reviewsUrl, { waitUntil: 'networkidle2' });
      let numberOfReviews = await getNumberOfReviews(page);
      if (numberOfReviews > 0) {
        console.log(`Number of reviews for release: ${releaseIds[i]}: ${numberOfReviews}`);
        const dataObj = createDataObj(numberOfReviews, releaseIds[i]);
        dataArr.push(dataObj);
      } else {
        console.log(`No reviews for release ${releaseIds[i]}`);
      }
      await page.waitForTimeout(3000).then(() => console.log('Delay 3000...'));
      //HANDLE COUNTER
      let counterValue = counter();
      if (counterValue === 1000) {
        counter = counterWrapper();
        writeJson({ reviewsData: dataArr }, `${process.env.STYLE}_${fileIndex}`, `json_output`);
        fileIndex++;
        dataArr = [];
      }
    }
    writeJson({ reviewsData: dataArr }, `${process.env.STYLE}_${fileIndex}`, `json_output`);
  } catch (err) {
    console.log('error in catch block: ', err);
  }
  process.exit(1);
};

init();
