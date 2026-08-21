import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

export default (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
};
