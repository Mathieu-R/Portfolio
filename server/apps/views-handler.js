const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const adaro = require('adaro');

const production = process.env.NODE_ENV === 'production';
const staticPath = './static';
const templatePath = './templates';
const inlineStyle = fs.readFileSync(path.join(staticPath, 'styles', 'inline.css'));

const options = {
  cache: production ? true : false,
  whitespace: production ? false : true,
  helpers: [
    require('../../helpers/add-hash')
  ]
};

const viewOptions = {
  title: 'Portfolio',
  styles: [path.join(staticPath, 'styles', 'ptf.css')],
  scripts: [path.join(staticPath, 'scripts', 'bundle.js')]
}

app.engine('dust', adaro.dust(options));
app.set('view engine', 'dust');
app.set('views', templatePath);

app.get('/', (req, res) => {
  res.status(200).render('sections/home',
  Object.assign(viewOptions, {
    inlineStyle
  }));
});

app.get('/cv', (req, res) => {
  res.status(200).render('sections/cv', viewOptions);
});

app.get('/activities', (req, res) => {
  res.status(200).render('sections/activities', viewOptions);
});

app.get('/projects', (req, res) => {
  res.status(200).render('sections/projects', viewOptions);
});

app.get('/learning', (req, res) => {
  res.status(200).render('sections/learning', viewOptions);
});

module.exports = app;
