const fs = require('fs');
const path = require('path');

const newFolderPath = path.join(__dirname, 'files-copy');
const oldFolderPath = path.join(__dirname, 'files');

let array = [];

fs.promises
  .mkdir(newFolderPath, { recursive: true })
  .then(() => {
    return fs.promises.readdir(oldFolderPath, 'utf-8');
  })
  .then((list) => {
    array = list;
    let promises = list.map((file) => {
      return fs.promises.copyFile(
        path.join(oldFolderPath, file),
        path.join(newFolderPath, file),
      );
    });
    return Promise.all(promises);
  })
  .then(() => {
    return fs.promises.readdir(newFolderPath).then((list) => {
      let promises = list.map((file) => {
        if (array.includes(file)) return new Promise((resolve) => resolve());
        else return fs.promises.rm(path.join(newFolderPath, file));
      });
      return Promise.all(promises);
    });
  })
  .catch((error) => console.log(error.message));
