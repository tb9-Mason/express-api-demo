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
      context: async (params) => ({ em: db.em.fork(), ...params }),
    }),
  );

  const server = app.listen({ port });

  process.on('SIGINT', () => shutdown());
  process.on('SIGTERM', () => shutdown());
  process.on('exit', (code) => {
    console.log(`Process exiting with code ${code}`);
  });

  const shutdown = async () => {
    // TODO: drain the gql server on shutdown: https://go.apollo.dev/s/drain
    await gqlServer.stop();
    console.log('GraphQL server stopped');
    await db.orm.close();
    console.log('DB closed');

    server.close(() => {
      process.exit(0);
    });
  };

  return { app, port };
}
