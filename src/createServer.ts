const poke = require('js.poke');
const { useID } = require('@dothq/id');
import encryptString from "./encrypt.js";
import setupServer from './serverSetup.js';
require('dotenv').config();

export default async function createBaseServer() {
  const options = {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${process.env.HETZNER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "automount": false,
      "image": "debian-10",
      "location": "fsn1",
      "name": `cloud-${useID()}`,
      "server_type": "cx11",
      "start_after_create": true,
      "ssh_keys": [
        "authoD"
      ]
    })
  };
  poke('https://api.hetzner.cloud/v1/servers', options)
    .promise()
    .then((res:any) => {
        return res.json()
    })
    .then(async (json:any) => {
      setupServer(await encryptString(json.server.public_net.ipv4.ip));
    })
}