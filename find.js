fileList = require("./walk");
var fs = require("fs");
/**
 *
 * @param {string} rootFolder - root folder, for example "E:\\VB-NET\\html"
 * @param {string} fileExt  - extension ".htm"
 * @param {string[]} ignoreSubfolders - for example ["E:\\VB-NET\\html\\Sql\\",""E:\\VB-NET\\html\\Dotnet\\Vb\\""]
 * @param {string} startTxt - string like `<table width=100%  FRAME="above"`
 * @param {string} endTxt - string like `&lt;<a onclick="window.open('','donate',`
 * @param {string} okLog - name with log result
 * @param {string[]} errLogs - 3 filenames with log result
 *
 */
module.exports = function find(rootFolder, fileExt, ignoreFolders, startTxt, endTxt, okLog, errLogs) {
  console.log(new Date().toUTCString());
  let i = 1,
    j = 1;
  let okStream = fs.createWriteStream(okLog);
  okStream.write(new Date().toUTCString() + '\r\n');
  let err1 = fs.createWriteStream(errLogs[0]);
  err1.write(`${new Date().toUTCString()} (has no end marker)\r\n`);
  let err2 = fs.createWriteStream(errLogs[1]);
  err2.write(`${new Date().toUTCString()} (has no start marker)\r\n`);
  let err3 = fs.createWriteStream(errLogs[2]);
  err3.write(`${new Date().toUTCString()} (has no start/stop marker)\r\n`);
  fileList(rootFolder, fileExt, ignoreFolders, (file) => {
    const data = fs.readFileSync(file, "utf-8");
    let startPos = data.indexOf(startTxt);
    let stoptPos = data.indexOf(endTxt);
    if (startPos > 0 && stoptPos > 0) {
      console.log(`${i++} ${file}`);
      okStream.write(`${i++}\t${file}\r\n`);
    } else if (startPos > 0 && stoptPos < 0) {
      console.log(`${j++} ${file} - has no end marker`);
      err1.write(`${j++}\t${file}\r\n`);
    } else if (startPos < 0 && stoptPos > 0) {
      console.log(`${j++} ${file} - has no start marker`);
      err2.write(`${j++}\t${file}\r\n`);
    } else {
      console.log(`${j++} ${file} - has no start/stop marker`);
      err3.write(`${j++}\t${file}\r\n`);
    }
  });
  okStream.end;
  okStream.close;
  err1.end;
  err1.close;
  err2.end;
  err2.close;
  err3.end;
  err3.close;
};

//Async reading - Error: EMFILE: too many open files
/* fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });*/
//fix too many open files https://stackoverflow.com/questions/75798375/explicitly-closing-a-file-after-readfilesync