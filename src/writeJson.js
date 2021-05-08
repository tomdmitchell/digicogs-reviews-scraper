import fsPromises from 'fs/promises';

const writeJson = async (data, fileName, dir) => {
  const jsonData = JSON.stringify(data, null, 2);
  try {
    await fsPromises.writeFile(`${dir}/${fileName}.json`, jsonData);
    console.log('JSON written...');
  } catch (err) {
    console.log(`ERROR writing JSON: `, err);
  }
};

export default writeJson;
