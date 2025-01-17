const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const assetsDistPath = path.join(distPath, 'assets');
const assetsPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

const writeStyleStream = fs.createWriteStream(path.join(distPath, 'style.css'));
const writeHtmlStream = fs.createWriteStream(path.join(distPath, 'index.html'));

const styles = [];
let html = '';

function createDirectory(directoryPath) {
  return fs.promises.mkdir(directoryPath, { recursive: true });
}

function copyAssets(directoryPath, newDirectoryPath) {
  return fs.promises.readdir(directoryPath, 'utf-8').then((list) => {
    let promises = list.map((file) => {
      const newPath = path.join(directoryPath, file);
      return fs.promises.stat(newPath).then((stats) => {
        const newDistPath = path.join(newDirectoryPath, file);
        if (stats.isDirectory())
          return createDirectory(newDistPath).then(() =>
            copyAssets(newPath, newDistPath),
          );
        return fs.promises.copyFile(newPath, newDistPath);
      });
    });
    return Promise.all(promises);
  });
}

function compileStylesIntoArray(directoryPath) {
  return fs.promises.readdir(directoryPath, 'utf-8').then((list) => {
    let promises = list.map((file) => {
      return fs.promises
        .readFile(path.join(directoryPath, file), 'utf-8')
        .then((data) => styles.push(data));
    });
    return Promise.all(promises);
  });
}

function bundleIntoFile(sourse, stream) {
  let entire;
  if (Array.isArray(sourse)) entire = sourse.join('');
  else entire = sourse;
  stream.write(entire);
}

function readTemplate() {
  return fs.promises.readFile(templatePath).then((data) => {
    html = data;
  });
}

function replaceTags() {
  return fs.promises.readdir(componentsPath).then((list) => {
    let promises = list.map((file) => {
      const filePath = path.join(componentsPath, file);
      const array = file.split('.');
      const tag = `{{${array[0]}}}`;
      if (html.includes(tag)) {
        return fs.promises.readFile(filePath).then((data) => {
          const index = html.indexOf(tag);
          html = html.slice(0, index) + data + html.slice(index + tag.length);
        });
      } else return new Promise((resolve) => resolve());
    });
    return Promise.all(promises);
  });
}

createDirectory(distPath)
  .then(() => createDirectory(assetsDistPath))
  .then(() => copyAssets(assetsPath, assetsDistPath))
  .then(() => compileStylesIntoArray(stylesPath))
  .then(() => bundleIntoFile(styles, writeStyleStream))
  .then(() => readTemplate())
  .then(() => replaceTags())
  .then(() => bundleIntoFile(html, writeHtmlStream))
  .catch((error) => console.log(error.message));
