import express, { Request, Response } from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import catchAsync from '../middleware/catchAsync';

export const actionRouter = (db: DatabaseAdapter) => {
  const router = express.Router();

  // get all
  router.get('/', catchAsync(async (_: Request, res: Response) => {
    const actions = await db.getTransactions();
    res.json(actions);
  }));

  // add one
  router.post('/', catchAsync(async (req: Request, res: Response) => {
    const { customerId, cart, deposit, time } = req.body;
    const action = await db.addTransaction(customerId, cart, deposit, time);
    res.json(action);
  }));
  return router;
};
