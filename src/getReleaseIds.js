import axios from 'axios';

const getReleaseIds = async (genre, style) => {
  const response = await axios.get(
    `https://digicogs-release-ids.s3-eu-west-1.amazonaws.com/${encodeURIComponent(
      genre
    )}/${encodeURIComponent(style)}.json`
  );
  return response.data.ids;
};

export default getReleaseIds;
