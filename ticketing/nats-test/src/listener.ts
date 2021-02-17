import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const queueGroupName = 'orders-service-queue-group';
  const subscription = stan.subscribe(
    'ticket:created',
    queueGroupName,
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(
        `Received event #${msg.getSequence()}, with data: ${JSON.parse(data)}`
      );
    }

    console.log('MESSAGE RECEIVED', msg.getSequence(), data);

    // * Let the nats know (acknowledge) that the event was successfully processed
    // * If you don't, nats will wait 30 seconds and try to send the event again.
    msg.ack();
  });
});

// * Stop client when node js execution has been interrupted or terminated
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
