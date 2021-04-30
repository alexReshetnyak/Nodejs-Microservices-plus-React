import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@alexey-corp/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
