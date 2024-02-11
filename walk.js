//https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
var fs = require("fs");
var path = require("path");
let n = 0;
var Ext;
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith(Ext)) {
            n++;
            //console.log(n++, file);
            results.push(file);
          }
          next();
        }
      });
    })();
  });
};

/**
 *
 * @param {string} rootFolder - root folder, for example "E:\\VB-NET\\html"
 * @param {string} fileExt  - extension ".htm"
 * @param {string[]} ignoreSubfolder - for example ["E:\\VB-NET\\html\\Sql\\",""E:\\VB-NET\\html\\Dotnet\\Vb\\""]
 * @param {function(string):void} processingFile - frunction for processing each file
 */
module.exports = function fileList(rootFolder, fileExt, ignoreSubfolder, processingFile) {
  Ext = fileExt;
  walk(rootFolder, function (err, results) {
    console.log(`found ${results.length} files`);
    if (err) throw err;
    results.sort().forEach((file) => {
      for (let i = 0; i < ignoreSubfolder.length; i++) {
        if (file.indexOf(ignoreSubfolder[i]) > -1) {
          return;
        }
      }
      processingFile(file);
    });
  });
};
