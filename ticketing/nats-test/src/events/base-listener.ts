import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';

import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], message: Message): void;

  protected ackWait = 5 * 1000; // * 5 sec

  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  listen(): void {
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
