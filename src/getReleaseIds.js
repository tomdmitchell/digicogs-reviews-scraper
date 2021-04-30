import axios from 'axios';

const getReleaseIds = async () => {
  const response = await axios.get(
    `https://tm-destination-test-123.s3-eu-west-1.amazonaws.com/${encodeURIComponent(
      process.env.STYLE
    )}.json`
  );
  // return response.data.ids;
  return response.data[process.env.STYLE];
};

export default getReleaseIds;
