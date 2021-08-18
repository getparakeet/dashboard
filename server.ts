const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const poke = require('js.poke');
const cookieParser = require('cookie-parser')
const { auth } = require('express-openid-connect');
import { requiresAuth } from "express-openid-connect";
import * as path from "path";
import createBaseServer from "./src/createServer.js"
import createCustomer, { chargeBase } from "./src/handlePayment.js";
import encryptString from "./src/encrypt.js";
import decryptString from "./src/decrypt.js";
import sql from "./src/db.js";
const app = express();
require('dotenv').config();
try {
  sql.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_HASHING_KEY,
  baseURL: 'http://localhost:3000',
  clientID: 'CQmqCPOL46mDy75l8LOdzminGaFIBYy2',
  issuerBaseURL: 'https://parakeet-cloud.eu.auth0.com',
  enableTelemetry: false
};

app.set('views', path.resolve('public'));
app.set('view engine', 'pug');
app.set('trust proxy', true);
app.use(express.static('public'));
app.use(cors());
app.use(auth(config));
app.use(helmet());
app.use(cookieParser())
app.get('/', (req: any, res: any) => {
  res.render('index');
})
// random auth routes i didnt know where else to put
app.get('/api/auth/userdata', (req: any, res: any) => {
  res.json(
    req.oidc.user
  );
})
// payment
app.get('/api/payment/create', requiresAuth(), async (req: any, res: any) => {
  if (req.cookies.cid) {
    res.sendStatus(403);
  } else {
    const customer: any = await createCustomer(req.oidc.user.email);
    const encryptedCustomerId = await encryptString(customer[0]);
    const encryptedUserId = await encryptString(customer[1]);
    res.cookie('cid', encryptedCustomerId, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    res.cookie('puid', encryptedUserId, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    res.sendStatus(200);
  }
});
app.get('/api/payment/charge/p1', requiresAuth(), async (req: any, res: any) => {
  const customerId = await decryptString(req.cookies.cid);
  const userId = await decryptString(req.cookies.puid);
  chargeBase(customerId, userId);
  res.sendStatus(200)
});
// server creation
app.get('/api/createserver', requiresAuth(), (req: any, res: any) => {
  createBaseServer();
});
  app.listen(3000, () => {
    console.log(`App listening at http://localhost:3000`)
  })