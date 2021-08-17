const Stripe = require('stripe');
const CryptoJS = require("crypto-js");
const { useID } = require('@dothq/id');
import sql from './db.js';
import encryptString from "./encrypt.js";
import decrypt from './decrypt.js';
require('dotenv').config();

// initialize stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Create customer
export default async function createCustomer(email: string) {
    const userId = useID();
    const customer = await stripe.customers.create({
        email: email,
    })
    const encryptedCustomerId = await encryptString(customer.id);
    sql.query(`INSERT INTO parakeetuserdata\nVALUES ('${userId}', '${encryptedCustomerId}', '0')`);
    return [encryptedCustomerId, userId];
};
// Charge for base price
export async function chargeBase(customerId: string, userId: string) {
    const charge = await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      customer: 'cus_K2h1omKPbfcQlW',
      source: 'tok_mastercard',
      description: 'My First Test Charge (created for API docs)',
    });
    console.log(charge);
}
export async function createCharge() {
    const charge = await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      customer: 'cus_K2h1omKPbfcQlW',
      source: 'tok_mastercard',
      description: 'My First Test Charge (created for API docs)',
    });
    console.log(charge);
}
