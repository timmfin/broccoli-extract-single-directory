var fs   = require('fs');
var path = require('path');
var mkdirp = require('mkdirp').sync;
var symlinkOrCopySync = require('symlink-or-copy').sync;

function BroccoliExtractSingleDirectory (inputTree, pathToExtract) {
  if (!(this instanceof BroccoliExtractSingleDirectory)) {
    return new BroccoliExtractSingleDirectory(inputTree, pathToExtract);
  }

  this.inputTree = inputTree;
  this.pathToExtract = pathToExtract;
}

BroccoliExtractSingleDirectory.prototype.rebuild = function () {
  var fullPathToExtract = path.join(this.inputPath, this.pathToExtract);
  var fullDestPath = path.join(this.outputPath, this.pathToExtract);

  var stats = fs.statSync(fullPathToExtract);

  if (!stats.isDirectory()) {
    throw new Error("Path to extract isn't a directory:", fullPathToExtract);
  }

  mkdirp(path.dirname(fullDestPath));
  symlinkOrCopySync(fullPathToExtract, fullDestPath)

  return this.outputPath;
}


module.exports = BroccoliExtractSingleDirectory;
