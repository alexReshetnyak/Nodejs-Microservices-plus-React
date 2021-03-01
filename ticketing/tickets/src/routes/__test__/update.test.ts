import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from './../../nats.wrapper';

it('returns 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test_title',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user does not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test_title',
      price: 20,
    })
    .expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test-title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'new-test-title',
      price: 30,
    })
    .expect(401);
});

it('returns 400 if the user provided an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test-title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new-test-title',
      price: -20,
    })
    .expect(400);
});

it('update the tickets provided valid inputs', async () => {
  const cookie = global.signin();
  const ticket = {
    title: 'test-title',
    price: 20,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket);

  ticket.title = 'new-test-title';
  ticket.price = 30;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(ticket)
    .expect(200);

  const updatedTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(updatedTicket.body.title).toEqual(ticket.title);
  expect(updatedTicket.body.price).toEqual(ticket.price);
});

it('publishes an event,', async () => {
  const cookie = global.signin();
  const ticket = {
    title: 'test-title',
    price: 20,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket);

  ticket.title = 'new-test-title';
  ticket.price = 30;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(ticket)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
