import fsPromises from 'fs/promises';
import path from 'path';
import writeJson from './writeJson.js';

const mergeJsons = async (dirPath, objKey, fileName) => {
  let masterArr = [];
  try {
    const allDirFiles = await fsPromises.readdir(`${dirPath}/`);
    const jsonFiles = allDirFiles.filter((file) => {
      return path.extname(file) === '.json';
    });
    for (let i = 0; i < jsonFiles.length; i++) {
      const rawFile = await fsPromises.readFile(`${dirPath}/${jsonFiles[i]}`);
      const parsedFile = JSON.parse(rawFile);
      parsedFile[objKey].forEach((obj) => {
        masterArr.push(obj);
      });
    }
    await writeJson({ [objKey]: masterArr }, fileName, `${dirPath}/`);
    console.log('JSONs merged...');
  } catch (err) {
    console.log(`ERROR merging JSONs: ${err}`);
  }
};

export default mergeJsons;
