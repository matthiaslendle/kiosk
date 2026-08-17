import express from 'express';
import cors from 'cors';

import { apiRouter } from './routes/api';

export class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());

    this.app.use('/api', apiRouter());
  }

  public start(port: number) {
    this.app.listen(port, () =>
      console.log(`listening at port ${port}`)
    );
  }
}
