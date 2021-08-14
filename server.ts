const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Identity = require('./src/identity.js');
import * as path from "path";
const app = express();

app.set('views', path.resolve('public'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.get('/', (req: any, res: any) => {
  res.render('index.pug')
})
// Identity
app.get('/identity', (req: any, res: any) => {
  Identity.loginOrSignup(req.query.email)
})
  app.listen(3000, () => {
    console.log(`App listening at http://localhost:3000`)
  })