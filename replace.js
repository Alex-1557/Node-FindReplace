const fs = require("fs");
const bak = require("./bak");

/**
 * @param {string} fileName file we handles
 * @param {string} startTxt start text marker
 * @param {string} endTxt end text marker
 * @param {string} insertTxt text need to replace between end of start marker and start of end marker
 */
module.exports = function replace(fileName, startTxt, endTxt, insertTxt) {
  const data = fs.readFileSync(fileName, "utf-8");
  let startPos = data.indexOf(startTxt);
  let stoptPos = data.indexOf(endTxt);
  if (startPos > 0 && stoptPos > 0) {
    bak(fileName);
    const out = fs.createWriteStream(fileName);
    out.write(`${data.substring(0, startPos + startTxt.length)}${insertTxt}${data.substring(stoptPos)}`);
    out.end;
    out.close;
  }
};
