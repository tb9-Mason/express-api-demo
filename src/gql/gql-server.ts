import path from 'path';

import { ApolloServer, BaseContext } from '@apollo/server';
import { EntityManager } from '@mikro-orm/postgresql';
import { buildSchemaSync } from 'type-graphql';

import { AlbumResolver, ArtistResolver, MemberResolver } from './resolvers';

export interface GqlContext extends BaseContext {
  em: EntityManager;
}

const schema = buildSchemaSync({
  resolvers: [AlbumResolver, ArtistResolver, MemberResolver],
  emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  validate: false,
});

export const gqlServer = new ApolloServer<GqlContext>({ schema });
