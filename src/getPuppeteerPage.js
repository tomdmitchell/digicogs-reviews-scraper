const getPuppeteerPage = async (browser) => {
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', (consoleObj) => console.log(consoleObj.text()));
  return page;
};

export default getPuppeteerPage;
