const fs = require('fs');
const crypto = require('crypto');

function readfile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, content) => {
      if (error) {
        reject(error);
      }
      resolve(content);
    });
  });
}

function createHash(content) {
  return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
}

function hash(dust) {
  dust.filters.hash = path => {
    return readfile(path)
      .then(content => createHash(content))
      .then(hash => path.replace(/([^\.]+)\.(.+)/, `$1.${hash}.$2`))
      .catch(error => console.log(error));
  }
}

module.exports = hash;
