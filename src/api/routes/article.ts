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

  router.get('/:id', catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    const article = await db.getArticleByID(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  }));

  router.post('/toggle/:id', catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    const article = await db.toggleArticle(req.params.id, req.body.disabled);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  }));

  router.patch('/:id', catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    const { name, category } = req.body;
    const article = await db.updateArticle(req.params.id, name, category);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  }));

  return router;
};
