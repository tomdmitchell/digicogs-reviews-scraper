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
// import counterWrapper from './counterWrapper.js';
import mergeJsons from './mergeJsons.js';
import getTimeStamp from './getTimestamp.js';

const init = async () => {
  //INIT COUNTER
  // let counter = counterWrapper();
  //INIT LOG
  let logObject = { failure: [], releasesWithReviews: 0 };
  //LAUNCH BROWSER
  const browser = await puppeteer.launch();
  let page = await getPuppeteerPage(browser);
  const releaseIds = await getReleaseIds(process.env.STYLE);
  //COUNT TOTAL RELEASES
  const yearsInObj = Object.keys(releaseIds.data);
  console.log(yearsInObj);
  ///SET YEAR START/END INDEXES
  let startIndex = process.env.START_INDEX ? Number(process.env.START_INDEX) : 0;
  let endIndex = process.env.END_INDEX ? Number(process.env.END_INDEX) : yearsInObj.length;
  //
  let totalReleases = 0;
  let countObj = {};
  for (let k = 0; k < yearsInObj.length; k++) {
    const lengthOfYearsArr = releaseIds.data[yearsInObj[k]].length;
    countObj[yearsInObj[k]] = lengthOfYearsArr;
    totalReleases = totalReleases + lengthOfYearsArr;
  }
  //BEGIN ITERATION
  for (let j = startIndex; j < endIndex; j++) {
    let dataArr = [];
    for (let i = 0; i < releaseIds.data[yearsInObj[j]].length; i++) {
      const runningTotal = countCurrentYearsIndex(yearsInObj[j], countObj) + i;
      const yearOfRelease = yearsInObj[j];
      const releaseId = releaseIds.data[yearsInObj[j]][i];
      const reviewsUrl = `https://www.discogs.com/release/${releaseId}/reviews`;
      console.log(
        `${process.env.STYLE} - URL ${runningTotal} of ${totalReleases}. ${i} of ${
          releaseIds.data[yearsInObj[j]].length - 1
        } in year ${yearOfRelease} (index: ${j}): ${reviewsUrl}`
      );
      try {
        await page.goto(reviewsUrl, { waitUntil: 'networkidle2' });
        //CHECK FOR PAGINATION ELEMENT
        try {
          await page.waitForSelector('.pagination_total', { timeout: 4000 });
        } catch (err) {
          console.log('***Error finding pagination element');
          logObject.failure.push({ releaseId: err.toString() });
          continue;
        }
        //GET NUMBER OF REVIEWS
        let numberOfReviews = await getNumberOfReviews(page);
        if (numberOfReviews > 0) {
          console.log(`Number of reviews for release: ${releaseId}: ${numberOfReviews}`);
          logObject.releasesWithReviews++;
          const dataObj = createDataObj(numberOfReviews, releaseId, yearOfRelease);
          dataArr.push(dataObj);
        } else {
          console.log(`No reviews for release ${releaseId}`);
        }
      } catch (err) {
        console.log('***Error in main catch block: ', err);
        logObject.failure.push({ releaseId: err.toString() });
        page = await getPuppeteerPage(browser);
      }
      //HANDLE COUNTER
      // let counterValue = counter();
      // if (counterValue === 1000) {
      //   counter = counterWrapper();
      //   await writeJson(
      //     { reviewsData: dataArr },
      //     `${process.env.STYLE}_${getTimeStamp()}`,
      //     `json_output`
      //   );
      //   dataArr = [];
      // }
      await page.waitForTimeout(4000).then(() => console.log('Delay 4000...'));
    }
    if (dataArr.length > 0) {
      await writeJson(
        { reviewsData: dataArr },
        `${process.env.STYLE}_${getTimeStamp()}_${yearsInObj[j]}`,
        `json_output`
      );
    } else {
      console.log('dataArr length is 0 - no JSON written')
    }
  }

  //WRITE REMAINING REVIEW DATA & ERR LOG
  // await writeJson(
  //   { reviewsData: dataArr },
  //   `${process.env.STYLE}_${getTimeStamp()}`,
  //   `json_output`
  // );
  await mergeJsons(`json_output`, `reviewsData`, `${process.env.STYLE}_master`);
  // await writeJson(logObject, 'log', 'log_output');
  process.exit(1);
};

const countCurrentYearsIndex = (year, countObj) => {
  const countObjYears = Object.keys(countObj);
  let runningTotal = 0;
  for (let i = 0; i < countObjYears.length; i++) {
    if (year === countObjYears[i]) break;
    runningTotal = runningTotal + countObj[countObjYears[i]];
  }
  return runningTotal;
};

init();
