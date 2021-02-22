import { Publisher, Subjects, TicketCreatedEvent } from '@alexey-corp/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
