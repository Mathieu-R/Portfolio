const fs = require('fs');
const crypto = require('crypto');

function readfile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (error) {
        reject(error);
      }
      resolve(content);
    });
  });
}

function createHash(content) {
  return new Promise(resolve => {
    const hash = crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');

    resolve(hash);
  });
}

function hash(dust) {
  dust.helpers.hash = (chunk, content, bodies, params) => {
    const path = params.path;
    readfile(path)
      .then(content => createHash(content))
      .then(hash => {
        const hashedUrl = path.replace('/([^\.]+)\.(.+)/', `$1.${hash}.$2`);
        chunk.write(hashedUrl).end();
      })
      .catch(error => new Error(error.message));
  }
}

module.exports = hash;
