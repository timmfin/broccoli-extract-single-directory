var fs   = require('fs');
var path = require('path');
var mkdirp = require('mkdirp').sync;
var symlinkOrCopySync = require('symlink-or-copy').sync;

function BroccoliExtractSingleDirectory (inputTree, pathToExtract, options) {
  if (!(this instanceof BroccoliExtractSingleDirectory)) {
    return new BroccoliExtractSingleDirectory(inputTree, pathToExtract);
  }




  this.inputTree = inputTree;
  this.pathToExtract = pathToExtract;
  this.options = options || {};

  this.allowMissing = this.options.allowMissing;

  if (this.allowMissing === undefined) {
    this.allowMissing = true;
  }
}

BroccoliExtractSingleDirectory.prototype.rebuild = function () {
  var fullPathToExtract = path.join(this.inputPath, this.pathToExtract);
  var fullDestPath = path.join(this.outputPath, this.pathToExtract);
  var stats;

  try {
    stats = fs.statSync(fullPathToExtract);
  } catch (error) {
    // If options.allowMissing is true, don't die if the directory is missing
    if (error.code === 'ENOENT' && this.allowMissing === true) {
      return this.outputPath;
    } else {
      console.error("Cannot extract", this.pathToExtract, "it is missing and options.allowMissing is _not_ true");
      throw error;
    }
  }

  if (!stats.isDirectory()) {
    throw new Error("Path to extract isn't a directory:", fullPathToExtract);
  }

  mkdirp(path.dirname(fullDestPath));
  symlinkOrCopySync(fullPathToExtract, fullDestPath)

  return this.outputPath;
}


module.exports = BroccoliExtractSingleDirectory;
