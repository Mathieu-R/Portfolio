const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const adaro = require('adaro');

const templatePath = path.join(__dirname, '..', '..');
const production = process.env.NODE_ENV === 'production';

const options = {
  cache: production ? true : false,
  whitespace: true,
  helpers: [
    require('../../helpers/add-hash')
  ]
};

const packageJson = JSON.parse(fs.readFileSync('package.json'));
const VERSION = packageJson['version'];

app.engine('js', adaro.dust(options));
app.set('view engine', 'js');
app.set('views', templatePath);

app.get('*', (req, res) => {
  res.set({'Content-Type': 'application/javascript'});
  res.status(200).render('service-worker', {
    version: VERSION
  });
});

module.exports = app;
