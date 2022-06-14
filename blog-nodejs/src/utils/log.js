const fs = require("fs");
const path = require("path");

//寫log
function writeLog(writeStream, log){
  writeStream.write(log + "\n")
}


//生成write stream
function createWriteStream(fileName){
  const fullFileName = path.join(__dirname, "../", "../", "logs", fileName);
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: "a"
  })
  return writeStream;
};

//寫訪問log
const accessWriteStream = createWriteStream("access.log");
function access(log){
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}