const fs = require("fs");
const bak = require("./bak");
const find = require("./find");
const replace = require("./replace");
const readline = require("readline");
const { resolve } = require("path");

const rootFolder = "E:\\VB-NET\\";
const ignoreFolders = ["E:\\VB-NET\\Sql\\", "E:\\VB-NET\\Dotnet\\Vb\\", "E:\\VB-NET\\AspNet-DocAndSamples-2017\\", "E:\\VB-NET\\VS2010_NET4_TrainingKit\\", "E:\\VB-NET\\Windows\\Installer\\"];
const okLog = "E:\\VB-NET\\Log\\ok.txt";
const errLogs = ["E:\\VB-NET\\Log\\err1.txt", "E:\\VB-NET\\Log\\err2.txt", "E:\\VB-NET\\Log\\err3.txt"];

const startTxt = `<table width=100%  FRAME="above" border=2 cellpadding=1 cellspacing=0 class="LNK" ><tr><td>`;
const endTxt = `&lt;<a onclick="window.open('','donate','resizable=no,menubar=no,scrollbars=no,width=400,height=300');"`;
const hotLink = `\n<!--#include virtual="/HotLink.htm" -->\n`;

const step1 = () => {
  //step 1 - create correct filelist from files ready to modification automatically
  find(rootFolder, ".htm", ignoreFolders, startTxt, endTxt, okLog, errLogs);
};

const step2 = () => {
  //step 2 - modify files
  const read = fs.createReadStream(okLog, "utf-8");
  const rl = readline.createInterface(read);
  let n = 0;
  rl.on("line", (l) => {
    let fileName = l.split("\t");
    console.log(n++, fileName[1]);
    if (fileName[1]) {
      replace(fileName[1], startTxt, endTxt, hotLink);
    }
  });
  rl.on("close", () => {
    console.log("done.");
  });
};

const step3 = () => {
  //modify files on simple filelist
  const read = fs.createReadStream("E:\\VB-NET\\Log\\err4.txt", "utf-8");
  const rl = readline.createInterface(read);
  let n = 0;
  rl.on("line", (fileName) => {
    console.log(n++, fileName);
    if (fileName) {
      replace(fileName, startTxt, endTxt, hotLink);
    }
  });
  rl.on("close", () => {
    console.log("done.");
  });
}

step3();
