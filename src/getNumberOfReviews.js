const getNumberOfReviews = async (page) => {
  return await page.evaluate(() => {
    const paginationElemContent = document.querySelector('.pagination_total').innerHTML.trim();
    if (paginationElemContent === '0 – 0 of 0') {
      return 0;
    } else {
      return Number(paginationElemContent.split('of')[1].trim());
    }
  });
};

export default getNumberOfReviews;
