import express from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import catchAsync from '../middleware/catchAsync';

export const customerRouter = (db: DatabaseAdapter) => {
  const router = express.Router();

  // Get all
  router.get('/', catchAsync(async (req, res) => {
    const customers = await db.getCustomers();
    res.json(customers);
  }));

  // Add new
  router.post('/', catchAsync(async (req, res) => {
    const customer = await db.addCustomer(req.body);
    if (req.body.credit !== 0) {
      db.addTransaction(customer.id, [], req.body.credit, new Date());
    }
    res.json(customer);
  }));

  // Get one by id
  router.get('/:id', catchAsync(async (req, res) => {
    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    const id = req.params.id;
    const customer = await db.getCustomerByID(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  }));

  router.patch('/:id', catchAsync(async (req, res) => {
    const { firstname, lastname, details, group } = req.body;
    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    const id = req.params.id;
    const customer = await db.updateCustomer(id, firstname, lastname, group, details);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  }));

  return router;
};
