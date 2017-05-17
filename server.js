const http = require('http');
const path = require('path');
const fs = require('mz/fs');
const serveStatic = require('serve-static');
const compression = require('compression');
const express = require('express');
const app = express();
const adaro = require('adaro');

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const staticPath = './static';
const templatePath = './templates';

const options = {
  cache: production ? true : false,
  whitespace: production ? false : true,
  helpers: []
};

app.use(compression());
app.use(serveStatic(staticPath, {
  maxAge: production ? (365 * 24 * 60 * 60 * 1000) : 0
}));

app.engine('dust', adaro.dust(options));
app.set('view engine', 'dust');
app.set('views', templatePath);

app.get('/', (req, res) => {
  res.status(200).render('home', {
    title: 'Portfolio',
    styles: [path.join(staticPath, 'styles', 'ptf.css')],
    scripts: [path.join(staticPath, 'scripts', 'build.js')]
  });
});

app.get('/check', res => res.send('server ok.'));

http.createServer(app).listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
})
