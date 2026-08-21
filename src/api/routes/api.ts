import express from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import { articleRouter } from './article';
import { customerRouter } from './customer';
import { actionRouter } from './action';
import { excelRouter } from './excel';

export const apiRouter = () => {

  const db = new DatabaseAdapter();

  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json({ status: 'API is Working' });
  });

  router.use('/article', articleRouter(db));
  router.use('/customer', customerRouter(db));
  router.use('/action', actionRouter(db));
  router.use('/excel', excelRouter(db));

  return router;
};
