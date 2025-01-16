const fs = require('fs');
const path = require('path');

const newFolderPath = path.join(__dirname, 'files-copy');
const oldFolderPath = path.join(__dirname, 'files');

try {
  fs.promises.mkdir(newFolderPath);
  let paths = fs.promises.readdir(path.join(__dirname, 'files'), {
    recursive: true,
  });
  paths.then((value) => {
    for (let element of value) {
      fs.promises.copyFile(
        path.join(oldFolderPath, element),
        path.join(newFolderPath, element),
      );
    }
  });
} catch (error) {
  console.log(error.message);
}
