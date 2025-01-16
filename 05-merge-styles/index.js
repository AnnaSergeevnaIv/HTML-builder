const fs = require('fs');
const path = require('path')

const startPath = path.join(__dirname, "styles");
const writeStream = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"))

let styles = [];

fs.promises.readdir(startPath)
  .then((files) =>  {
      let promises = files.map((file) => {
        const filePath = path.join(startPath, file);
        if (path.extname(file) === ".css") 
          return fs.promises.readFile(filePath, "utf-8").then((data) => styles.push(data))
      })
      return Promise.all(promises);
    })
    .then(() => writeStyles())

function writeStyles() {
  let entireStyle = styles.join("");
  console.log(styles)
  writeStream.write(entireStyle)
}

