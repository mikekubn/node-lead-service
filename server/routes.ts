import { Application } from 'express';
import leadRouter from './api/controllers/lead/router';
import metaRouter from './api/controllers/meta/router';
export default function routes(app: Application): void {
  app.use('/api/v1/leads', leadRouter);
  app.use('/api/v1/meta', metaRouter);
}
