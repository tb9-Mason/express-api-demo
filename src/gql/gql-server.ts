import path from 'path';

import { ApolloServer } from '@apollo/server';
import { EntityManager } from '@mikro-orm/postgresql';
import { buildSchemaSync } from 'type-graphql';

import { ArtistResolver } from './resolvers/artist.resolver';

export interface GqlContext {
  em: EntityManager;
}

const schema = buildSchemaSync({
  resolvers: [ArtistResolver],
  emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  validate: false,
});

export const gqlServer = new ApolloServer<GqlContext>({ schema });
