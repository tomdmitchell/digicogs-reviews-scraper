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
import mergeJsons from './mergeJsons.js';
import getTimeStamp from './getTimestamp.js';

const init = async () => {
  //INIT COUNTER
  let counter = counterWrapper();
  //INIT LOG
  let logObject = { failure: [], releasesWithReviews: 0 };
  //LAUNCH BROWSER
  const browser = await puppeteer.launch();
  let page = await getPuppeteerPage(browser);
  const releaseIds = await getReleaseIds(process.env.GENRE, process.env.STYLE);
  let dataArr = [];
  ///SET INDEXES
  let startIndex = process.env.START_INDEX ? Number(process.env.START_INDEX) : 0;
  let endIndex = process.env.END_INDEX ? Number(process.env.END_INDEX) : releaseIds.length;
  //BEGIN ITERATION
  for (let i = startIndex; i < endIndex; i++) {
    const reviewsUrl = `https://www.discogs.com/release/${releaseIds[i]}/reviews`;
    console.log(`${process.env.STYLE} - URL ${i} of ${releaseIds.length - 1}: ${reviewsUrl}`);
    try {
      await page.goto(reviewsUrl, { waitUntil: 'networkidle2' });
      //CHECK FOR PAGINATION ELEMENT
      try {
        await page.waitForSelector('.pagination_total', { timeout: 4000 });
      } catch (err) {
        console.log('***Error finding pagination element');
        logObject.failure.push({ [releaseIds[i]]: err.toString() });
        continue;
      }
      //GET NUMBER OF REVIEWS
      let numberOfReviews = await getNumberOfReviews(page);
      if (numberOfReviews > 0) {
        console.log(`Number of reviews for release: ${releaseIds[i]}: ${numberOfReviews}`);
        logObject.releasesWithReviews++;
        const dataObj = createDataObj(numberOfReviews, releaseIds[i]);
        dataArr.push(dataObj);
      } else {
        console.log(`No reviews for release ${releaseIds[i]}`);
      }
    } catch (err) {
      console.log('***Error in main catch block: ', err);
      logObject.failure.push({ [releaseIds[i]]: err.toString() });
      page = await getPuppeteerPage(browser);
    }
    //HANDLE COUNTER
    let counterValue = counter();
    if (counterValue === 1000) {
      counter = counterWrapper();
      await writeJson(
        { reviewsData: dataArr },
        `${process.env.STYLE}_${getTimeStamp()}`,
        `json_output`
      );
      dataArr = [];
    }
    await page.waitForTimeout(4000).then(() => console.log('Delay 4000...'));
  }

  //WRITE REMAINING REVIEW DATA & ERR LOG
  await writeJson(
    { reviewsData: dataArr },
    `${process.env.STYLE}_${getTimeStamp()}`,
    `json_output`
  );
  await mergeJsons(`json_output`, `reviewsData`, `${process.env.STYLE}_master`);
  await writeJson(logObject, 'log', 'log_output');
  process.exit(1);
};

init();
