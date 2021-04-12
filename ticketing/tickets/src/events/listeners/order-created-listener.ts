import { Listener, OrderCreatedEvent, Subjects } from '@alexey-corp/common';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // * Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // * If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticker not found');
    }

    // * Mark the ticket as being reserved by setting it's orderId property
    ticket.set({ orderId: data.id });

    // * Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // * ack the message
    msg.ack();
  }
}
