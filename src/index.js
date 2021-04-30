import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

import writeJson from './writeJson.js';
import createDataObj from './createDataObj.js';
import getPuppeteerPage from './getPuppeteerPage.js';
import getNumberOfReviews from './getNumberOfReviews.js';
import getReleaseIds from './getReleaseIds.js';

const init = async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await getPuppeteerPage(browser);
    const releaseIds = await getReleaseIds();
    let dataArr = [];
    //BEGIN ITERATION
    for (let i = 0; i < 20; i++) {
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
    }
    writeJson({ reviewsData: dataArr }, process.env.STYLE, 'json_output');
  } catch (err) {
    console.log('error in catch block: ', err);
  }
  process.exit(1);
};

init();
