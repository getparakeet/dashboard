const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { auth } = require('express-openid-connect');
import { requiresAuth } from "express-openid-connect";
import * as path from "path";
const app = express();
require('dotenv').config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_HASHING_KEY,
  baseURL: 'http://localhost:3000',
  clientID: 'CQmqCPOL46mDy75l8LOdzminGaFIBYy2',
  issuerBaseURL: 'https://parakeet-cloud.eu.auth0.com'
};

app.set('views', path.resolve('public'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cors());
app.use(auth(config));
app.use(helmet());
app.get('/', (req: any, res: any) => {
  res.render('index.pug')
})
app.get('/api/userdata', requiresAuth(), (req: any, res: any) => {
  res.send(JSON.stringify(req.oidc.user))
});
  app.listen(3000, () => {
    console.log(`App listening at http://localhost:3000`)
  })