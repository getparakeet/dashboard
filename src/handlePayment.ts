const Stripe = require('stripe');
const CryptoJS = require("crypto-js");
const { useID } = require('@dothq/id');
import encryptString from "./encrypt.js";
import decrypt from './decrypt.js';
require('dotenv').config();

// initialize stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
export async function handleStripeCheckout() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Parakeet Pro',
          },
          unit_amount: 1199,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/api/payment/success',
    cancel_url: 'http://localhost:3000/api/payment/cancel',
  });
  return session;
}