const crypto = require("crypto");

//key
const SECRET_KEY = "sii3go++_DSA%%321";

//md5加密
function md5(content){
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
}

//加密函數
function genPassword(password){
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

module.exports = {
  genPassword
}