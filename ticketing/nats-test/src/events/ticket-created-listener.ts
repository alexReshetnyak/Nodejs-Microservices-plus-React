import { Message } from 'node-nats-streaming';

import { Subjects } from './subjects';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data: ', data);

    // * Let the nats know (acknowledge) that the event was successfully processed
    // * If you don't, nats will wait 30 seconds and try to send the event again.
    msg.ack();
  }
}
