import { expressMiddleware } from '@as-integrations/express5';
import { RequestContext } from '@mikro-orm/core';
import cors from 'cors';
import express from 'express';

import { initORM } from './db';
import { GqlContext, gqlServer } from './gql/gql-server';
import OrmConfig from './mikro-orm.config';

export async function init(port: string | number = 5000, migrate = true) {
  // Initialize mikro-orm and optionally run any pending migrations
  const db = await initORM(OrmConfig);
  if (migrate) {
    await db.orm.migrator.up();
  }
  const app = express();

  // Await gql server start to ensure the schema is loaded
  await gqlServer.start();

  app.use(express.json());

  // Create a new request context for each incoming server request
  app.use((req, res, next) => RequestContext.create(db.em, next));

  // Use json, enable cors, and attach the graphql server at /graphql
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware<GqlContext>(gqlServer, {
      context: async () => ({ em: db.em.fork() }),
    }),
  );

  await app.listen({ port });

  return { app, port };
}
