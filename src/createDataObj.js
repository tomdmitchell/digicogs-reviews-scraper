const createDataObj = (numberOfReviews, releaseId) => {
  let dataObj = {};
  dataObj.numberOfReviews = numberOfReviews;
  dataObj.releaseId = releaseId;
  dataObj.style = sanitiseStyle(process.env.STYLE);
  return dataObj;
};

const sanitiseStyle = (style) => {
  return style.replace(/[^0-9a-z]/gi, '_').toLowerCase();
};

export default createDataObj;
