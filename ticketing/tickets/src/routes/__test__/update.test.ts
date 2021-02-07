import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

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

it('returns 401 if the user does not own the ticket', async () => {});

it('returns 400 if the user provided an invalid title or price', async () => {});

it('update the tickets provided valid inputs', async () => {});
