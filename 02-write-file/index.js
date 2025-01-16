const { stdin } = process;
const path = require('path');
const fs = require('fs');

const textPath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(textPath);

const farewell = () => console.log('Goodbye!');
console.log('Write you text, please');

stdin.on('data', (data) => {
  let dataString = data.toString();
  if (dataString === 'exit\n') {
    process.exit();
  }
  output.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', farewell);
