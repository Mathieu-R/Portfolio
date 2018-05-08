const http = require('http');
const path = require('path');
const fs = require('fs');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const promisify = require('es6-promisify');
const removeHash = require('../middlewares/remove-hash');

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const staticPath = './static'
const swPath = './service-worker.js';

app.use(removeHash);
app.use(validator());
app.use(compression());
app.use(bodyParser.json());
app.use('/static', serveStatic(staticPath, {
  maxAge: production ? (365 * 24 * 60 * 60 * 1000) : 0
}));

app.use('/sw.js', require('./apps/sw-handler'));
app.use('/', require('./apps/views-handler'));
app.get('/check', res => res.send('server ok.'));

app.get('/download-cv.pdf', (req, res) => {
  const stream = fs.createReadStream(path.join(__dirname, 'CV.pdf'));
  stream.pipe(res);
});

app.post('/contact', async (req, res) => {
  try {
    const info = await sendMail(req.body);
    res.status(200).json({success: 'Message envoyé à Mathieu Rousseau.'});
  } catch(err) {
    res.status(500).json({err: [err.message.toString()]});
  }
});

function sendMail({name, mail, subject, message}) {
  const transporter = nodemailer.createTransport({
    host: production ? process.env.HOSTMAIL : 'localhost',
    port: production ? 465 : 1025, // port pour maildev
    secure: production ? true : false,
    ignoreTLS: production ? false : true,
    auth: production ? {
      user: process.env.USERMAIL,
      pass: process.env.PASSMAIL
    } : false
  });

  const mailOptions = {
    from: `${name} <${mail}>`,
    to: process.env.USERMAIL,
    subject: subject,
    text: message
  };

  return promisify(transporter.sendMail, transporter)(mailOptions);
}

function validateMessage(req, res, next) {
  req.checkBody('name', "Le nom est vide.").notEmpty();
  req.checkBody('mail', "L'e-mail est vide.").notEmpty();
  req.checkBody('mail', "L'e-mail n'est pas valide (example@example.com).").isEmail();
  req.checkBody('subject', 'Le sujet est vide.').notEmpty();
  req.checkBody('message', 'Le message est vide.')
  req.checkBody('message', 'Le message est trop court').len(8, 500);

  const errors = req.validationErrors();
  if (errors) {
    return res.status(500).json({err: errors.map(err => err.msg)});
  }

  next();
}

http.createServer(app).listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
});
