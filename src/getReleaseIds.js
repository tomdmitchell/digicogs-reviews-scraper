import axios from 'axios';

const getReleaseIds = async (style) => {
  const response = await axios.get(
    `https://digicogs-release-ids.s3-eu-west-1.amazonaws.com/${encodeURIComponent(style)}.json`
  );

  return response.data;
};

export default getReleaseIds;
