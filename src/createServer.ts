const hetzner = require('hcloud-js');
const { useID } = require('@dothq/id');
require('dotenv').config();

const client = new hetzner.Client(process.env.HETZNER_API_KEY)

export default async function createBaseServer() {
    const { server } = await client.servers.build(`cloud-${useID()}`)
      .serverType('cx11')
      .location('fsn1')
      .image('debian-10')
      .create()
    console.log(server);
}