const { NodeSSH } = require('node-ssh')
const fs = require('fs')
import decryptString from "./decrypt.js";

const SSH = new NodeSSH();

export default async function setupServer(encryptedIp: string) {
    console.log('working...');
    const deip = await decryptString(encryptedIp);
    console.log(deip);
    setTimeout(() => {
        SSH.connect({
            host: deip,
            username: 'root',
            privateKey: fs.readFileSync('./shields/id_rsa', 'utf8')
        })
        .then(() => {
            console.log('connected');
        })
    }, 5000);
}