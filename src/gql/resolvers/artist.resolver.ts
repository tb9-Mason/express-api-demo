import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';

import { Artist, Member } from '../../entities';
import { GqlContext } from '../gql-server';

@Resolver((_of) => Artist)
export class ArtistResolver {
  @Query((_returns) => Artist, { nullable: true })
  artist(@Arg('id', (_type) => String) id: string, @Ctx() { em }: GqlContext) {
    // TODO: change to findOneOrFail and add gql error shapes
    return em.findOne(Artist, id);
  }

  @Query((_returns) => [Artist])
  artists(@Ctx() { em }: GqlContext) {
    return em.findAll(Artist);
  }

  // TODO: find a way to reduce the amount of n+1 queries that happen when
  // populating relationships
  @FieldResolver((_returns) => [Member])
  async members(@Root() artist: Artist, @Ctx() { em }: GqlContext) {
    await em.populate(artist, ['members']);
    return artist.members;
  }

  // TODO: find a way to reduce the amount of n+1 queries that happen when
  // populating relationships
  @FieldResolver((_returns) => [Member])
  async albums(@Root() artist: Artist, @Ctx() { em }: GqlContext) {
    await em.populate(artist, ['albums']);
    return artist.albums;
  }
}
