const fs = require('fs');
const crypto = require('crypto');

function readFileContent(path) {
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
  dust.helpers.hash = (chunk, context, bodies, params) => {
    return chunk.map(async chunk => {
      const path = params.path;
      const content = await readFileContent(path);
      const hash = await createHash(content);
      const hashedPath = path.replace(/([^\.]+)\.(.+)/, `$1.${hash}.$2`);
      return chunk.write(hashedPath).end();
    });
  }
}

module.exports = hash;
