import express, { Request, Response } from 'express';
import { requireAuth } from '@alexey-corp/common';

const router = express.Router();

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  console.log('TEST TEST');
  res.sendStatus(200);
});

export { router as createTicketRouter };
