import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('it returns 404 if the ticket not found', async () => {
  const notExistingId = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${notExistingId}`).send().expect(404);
});

it('it returns the ticket if the ticket is found', async () => {
  const testTicket = {
    title: 'test_title',
    price: 20,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(testTicket);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(testTicket.title);
  expect(ticketResponse.body.price).toEqual(testTicket.price);
});
