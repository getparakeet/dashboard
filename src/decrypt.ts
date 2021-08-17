const CryptoJS = require("crypto-js");
require('dotenv').config();

export default async function decryptString(string: string) {
    let decryptedBytes = CryptoJS.AES.decrypt(string, process.env.HASHING_KEY);
    let decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedString;
}