import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const clusterId = 'ticketing';
const randomClientId = randomBytes(4).toString('hex');
const stan = nats.connect(clusterId, randomClientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// * Stop client when node js execution has been interrupted or terminated
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
