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

async function hash(dust) {
  dust.filters.hash = path => {
    const content = await readfile(path);
    const hash = createHash(content);
    return path.replace(/([^\.]+)\.(.+)/, `$1.${hash}.$2`);
  }
}

module.exports = hash;
