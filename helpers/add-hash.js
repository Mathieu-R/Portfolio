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
  const hash = crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  return hash;
}

function hash(dust) {
  dust.filters.hash = path => {
    const filtre = readfile(path)
      .then(content => createHash(content))
      .then(hash => {
        const hashedUrl = path.replace(/([^\.]+)\.(.+)/, `$1.${hash}.$2`);
        console.log('hash', hashedUrl)
        return hashedUrl;
      })
      .catch(error => new Error(error.message));
    console.log(filtre);
  }
}

module.exports = hash;
