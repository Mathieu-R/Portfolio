const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const adaro = require('adaro');

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const staticPath = './static';
const templatePath = './templates';

router.use(express.static(staticPath, {
  maxAge: production ? (365 * 24 * 60 * 60 * 1000) : 0
}));

router.get('/check', res => res.send('server ok.'));

app.use('router');

http.createServer(app).listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
})
