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
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_HASHING_KEY,
  baseURL: 'http://localhost:3000',
  clientID: 'CQmqCPOL46mDy75l8LOdzminGaFIBYy2',
  issuerBaseURL: 'https://parakeet-cloud.eu.auth0.com',
  enableTelemetry: false
};
try {
  sql.authenticate();
  console.log("Connected");
} catch (error) {
  console.log("There was an error connecting", error);
}
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
app.get('/dashboard', requiresAuth(), (req: any, res: any) => {
  res.render('dashboard');
});
// Create project
app.get('/patagonia/add-project', requiresAuth(), (req: any, res: any) => {
  let error = ""
  if (req.query.error === "noerror") {
    error = "There was an error. We're not sure why. Give it a couple minutes. If it doesn't work, let us know by emailing us at contact@getparakeet.dev";
  } else if (req.query.error === "name-already-taken") {
    error = "That name is already taken."
  } else if (req.query.error === "name-too-long") {
    error = "That name is too long. Please make sure it's under 32 characters."
  } else if (req.query.error === "name-too-short") {
    error = "That name is too short. Please make sure it's at least 3 characters."
  } else if (req.query.error === "stop-being-naughty") {
    error = "You're not allowed to do that. Stop being naughty."
  } else if (req.query.error === "no-name") {
    error = "Please enter a name."
  }
  res.render('add-project', { err: error });
});
// random auth routes i didnt know where else to put
app.get('/api/auth/userdata', (req: any, res: any) => {
  res.json(
    req.oidc.user
  );
})
// Project creation
app.get('/patagonia/create-project', requiresAuth(), async (req: any, res: any) => {
  res.render('choose-a-plan');
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