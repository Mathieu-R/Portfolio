/**
 * Remove the hash from the static file when request is made
 * So the server can locate the file
 */
function removeHash(req, res, next) {
  req.url = req.url.replace('/[a-f0-9]{64}\./', '');
  next();
}

module.exports = removeHash;
