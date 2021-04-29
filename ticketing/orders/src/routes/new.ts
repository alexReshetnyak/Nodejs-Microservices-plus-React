import { OrderCreatedPublisher } from './../events/publishers/order-created-publisher';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@alexey-corp/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import { natsWrapper } from '../nats.wrapper';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 15 minutes

router.post(
  '/api/orders/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => {
        return mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage('Ticket ID must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
