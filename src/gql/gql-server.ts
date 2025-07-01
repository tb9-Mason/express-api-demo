import path from 'path';

import { ApolloServer, BaseContext } from '@apollo/server';
import { EntityManager } from '@mikro-orm/postgresql';
import { buildSchemaSync } from 'type-graphql';

import { formatError } from './errors/format-error';
import { AlbumResolver, ArtistResolver, MemberResolver } from './resolvers';

export interface GqlContext extends BaseContext {
  em: EntityManager;
}

const schema = buildSchemaSync({
  resolvers: [AlbumResolver, ArtistResolver, MemberResolver],
  emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  validate: true,
});

export const gqlServer = new ApolloServer<GqlContext>({
  schema,
  formatError,
  introspection: process.env.NODE_ENV !== 'production',
});
