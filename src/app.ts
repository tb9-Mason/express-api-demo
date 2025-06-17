import { RequestContext } from '@mikro-orm/core';
import express from 'express';

import { initORM } from './db';
import OrmConfig from './mikro-orm.config';

export async function init(port: string | number = 5000, migrate = true) {
  const db = await initORM(OrmConfig);
  if (migrate) {
    await db.orm.migrator.up();
  }
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => RequestContext.create(db.em, next));

  app.get('/', (req, res) => {
    res.json({ key: 'value' });
  });

  await app.listen({ port });

  return { app, port };
}
