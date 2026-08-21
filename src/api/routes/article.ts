import express, { Request, Response } from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import catchAsync from '../middleware/catchAsync';

export const articleRouter = (db: DatabaseAdapter) => {
  const router = express.Router();

  router.get('/', catchAsync(async (req: Request, res: Response) => {
    const articles = await db.getArticles();
    res.json(articles);
  }));

  router.post('/', catchAsync(async (req: Request, res: Response) => {
    const article = await db.addArticle(req.body);
    res.json(article);
  }));

  router.get('/:id', catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const article = await db.getArticleByID(id);
    res.json(article);
  }));

  router.post('/disable', catchAsync(async (req: Request, res: Response) => {
    const article = await db.disableArticle(req.body.id, req.body.disabled);
    res.json(article);
  }));

  router.patch('/:id', catchAsync(async (req: Request<{ id: string }>, res: Response) => {
    const { name, category } = req.body;
    const article = await db.updateArticle(parseInt(req.params.id, 10), name, category);
    res.json(article);
  }));

  return router;
};
