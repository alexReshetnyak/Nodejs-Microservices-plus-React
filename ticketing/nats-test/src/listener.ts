import nats, { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';
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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // * Send all not processed history events when listener starts
    .setDurableName('accounting-service');

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name', // * Set group name to avoid events history cleaning when listener restarts
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

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, message: Message): void;

  protected ackWait = 5 * 1000; // * 5 sec

  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  protected listen(): void {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  private parseMessage(msg: Message): any {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }

  private subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // * Send all not processed history events when listener starts
      .setManualAckMode(true)
      .setAckWait(this.ackWait) // * wait for 5 sec before repeat failed event
      .setDurableName(this.queueGroupName);
  }
}
