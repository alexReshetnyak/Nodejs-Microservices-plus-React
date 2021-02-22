import { Publisher, Subjects, TicketUpdatedEvent } from '@alexey-corp/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
