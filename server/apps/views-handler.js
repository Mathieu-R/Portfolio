const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const adaro = require('adaro');
const iterateHelper = require('dustmotes-iterate');

const production = process.env.NODE_ENV === 'production';
const staticPath = './static';
const templatePath = './templates';

const activities = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'activities.json')));
const cv = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'cv.json')));
const learnings = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'learning.json')));
const projects = JSON.parse(fs.readFileSync(path.join(staticPath, 'json', 'projects.json')));
const inlineStyle = fs.readFileSync(path.join(staticPath, 'styles', 'inline.css'));

const options = {
  cache: production ? true : false,
  whitespace: production ? false : true,
  helpers: [
    require('../../helpers/add-hash'),
    require('../../filters/normalize-date'),
    iterateHelper
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
  res.status(200).render('sections/cv',
  Object.assign(viewOptions, {
    cv
  }));
});

app.get('/activities', (req, res) => {
  res.status(200).render('sections/activities',
  Object.assign(viewOptions, {
    activities
  }));
});

app.get('/projects', (req, res) => {
  res.status(200).render('sections/projects',
  Object.assign(viewOptions, {
    projects
  }));
});

app.get('/learning', (req, res) => {
  res.status(200).render('sections/learning',
  Object.assign(viewOptions, {
    learnings
  }));
});

module.exports = app;
