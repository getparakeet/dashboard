const CryptoJS = require("crypto-js");
require('dotenv').config();

export default async function encryptString(string: string) {
    const encryptedString = CryptoJS.AES.encrypt(string, process.env.HASHING_KEY).toString();
    return encryptedString;
}