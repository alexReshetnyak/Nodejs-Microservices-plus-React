import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('Returns an error if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('Returns an error if ticket has already reserved', async () => {});

it('Reserves a ticket', async () => {});
