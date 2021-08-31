import { Publisher, PaymentCreatedEvent, Subjects } from '@alexey-corp/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
