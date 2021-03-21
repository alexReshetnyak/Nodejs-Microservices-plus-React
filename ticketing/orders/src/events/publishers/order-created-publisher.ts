import { Publisher, OrderCreatedEvent, Subjects } from '@alexey-corp/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
