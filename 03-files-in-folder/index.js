const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');
console.log(folderPath);

try {
  const paths = fs.promises.readdir(folderPath, 'utf-8');
  paths.then((value) => {
    for (let element of value) {
      const fileInfo = path.parse(path.join(folderPath, element));
      fs.stat(path.join(folderPath, element), (err, stats) => {
        if (!stats.isDirectory())
          console.log(
            `${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${
              stats.size / 1024
            }kb`,
          );
      });
    }
  });
} catch (error) {
  console.log(error.message);
}
