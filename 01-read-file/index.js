const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt")
const readableStreem = fs.createReadStream(filePath, "utf-8")

readableStreem.on("data", (data) => console.log(data))