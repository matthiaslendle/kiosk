import express, { Response, Request } from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import catchAsync from '../middleware/catchAsync';

export const customerRouter = (db: DatabaseAdapter) => {
  const router = express.Router();

  // Get all
  router.get('/', catchAsync(async (req: Request, res: Response) => {
    const customers = await db.getCustomers();
    res.json(customers);
  }));

  // Add new
  router.post('/', catchAsync(async (req: Request, res: Response) => {
    const customer = await db.addCustomer(req.body);
    if (req.body.credit !== 0) {
      db.addTransaction(customer.id, [], req.body.credit, new Date());
    }
    res.json(customer);
  }));

  // Get one by id
  router.get('/:id', catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const customer = await db.getCustomerByID(id);
    res.json(customer);
  }));

  router.patch('/:id', catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const { firstname, lastname, details, group } = req.body;
    const id = parseInt(req.params.id, 10);
    const customer = await db.updateCustomer(id, firstname, lastname, group, details);
    res.json(customer);
  }));

  return router;
};
