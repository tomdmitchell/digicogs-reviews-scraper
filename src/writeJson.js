import fs from 'fs';

const writeJson = (data, fileName, dir) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(`${dir}/${fileName}.json`, jsonData);
  console.log('JSON written...');
};

export default writeJson;
