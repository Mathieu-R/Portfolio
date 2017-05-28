const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const compression = require('compression');
const express = require('express');
const app = express();
const removeHash = require('../middlewares/remove-hash');

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const staticPath = './static'
const swPath = './service-worker.js';

app.use(removeHash);
app.use(compression());
app.use('/static', serveStatic(staticPath, {
  maxAge: production ? (365 * 24 * 60 * 60 * 1000) : 0
}));

/*app.use('/sw.js', serveStatic(swPath, {
  maxAge: 0 // never cache the service-worker
}));*/

app.use('/sw.js', require('./apps/sw-handler'));
app.use('/', require('./apps/views-handler'));
app.get('/check', res => res.send('server ok.'));

http.createServer(app).listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
});
