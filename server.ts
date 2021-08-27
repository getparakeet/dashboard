const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const poke = require('js.poke');
const Stripe = require('stripe');
const cookieParser = require('cookie-parser')
const { auth } = require('express-openid-connect');
import { requiresAuth } from "express-openid-connect";
import * as path from "path";
import createBaseServer from "./src/createServer.js"
import encryptString from "./src/encrypt.js";
import decryptString from "./src/decrypt.js";
import sql from "./src/db.js";
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
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
app.get('/api/patagonia/start-project/:plan', requiresAuth(), async (req: any, res: any) => {
  poke(`http://localhost/api/payment/create-checkout-session/${req.params.plan}`,
    {port: 3000, method: 'POST'})
    .promise()
    .then((response: any) => { res.redirect(response.headers.location) })
    .catch((err: any) => {
      console.log('Error: ', err)
    });
})
app.post('/api/payment/create-checkout-session/:plan', async (req: any, res: { redirect: (arg0: number, arg1: any) => void; }) => {
  const plan = req.params.plan;
  let price = "";
  if (plan === "1") {
    price = "price_1JQbINHEYvOcf3HrKenaDzmO";
  } else if (plan === "2") {
    price = "price_1JQbIoHEYvOcf3HrzKmOltr8";
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `http://localhost:${PORT}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:${PORT}/api/payment/cancelled`,
  });

  res.redirect(303, session.url);
});
app.get('/api/payment/success', async (req: any, res: any) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id
  );
  if (session.payment_status === "paid") {
    const encrypted = encryptString(session.id);
    res.cookie('paidId', encrypted, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    res.render("payment-success");
  }
});
// server creation
app.get('/api/createserver', requiresAuth(), (req: any, res: any) => {
  createBaseServer();
});
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
  })