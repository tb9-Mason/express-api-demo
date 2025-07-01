import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql';

import { Album, Artist, Member } from '../../entities';
import { GqlContext } from '../gql-server';
import fieldsToRelations from '../utilities/fields-to-relations';

@Resolver((_of) => Artist)
export class ArtistResolver {
  @Query((_returns) => Artist, { nullable: true })
  artist(@Arg('id', (_type) => String) id: string, @Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Artist>(info, Artist, em);
    return em.findOneOrFail(Artist, id, { populate: relations });
  }

  @Query((_returns) => [Artist!]!)
  artists(@Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Artist>(info, Artist, em);
    return em.findAll(Artist, { populate: relations });
  }

  @FieldResolver((_returns) => [Member!]!)
  async members(@Root() artist: Artist, @Ctx() _ctx: GqlContext) {
    return artist.members;
  }

  @FieldResolver((_returns) => [Album!]!)
  async albums(@Root() artist: Artist, @Ctx() _ctx: GqlContext) {
    return artist.albums;
  }
}
