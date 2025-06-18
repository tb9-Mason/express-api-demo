import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql';

import { Album, Artist } from '../../entities';
import { GqlContext } from '../gql-server';
import fieldsToRelations from '../utilities/fields-to-relations';

@Resolver((_of) => Album)
export class AlbumResolver {
  @Query((_returns) => Album, { nullable: true })
  album(@Arg('id', (_type) => String) id: string, @Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Album>(info, Album, em);
    return em.findOne(Album, id, { populate: relations });
  }

  @Query((_returns) => [Album], { nullable: true })
  albums(@Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Album>(info, Album, em);
    return em.findAll(Album, { populate: relations });
  }

  @FieldResolver((_returns) => [Artist])
  async artist(@Root() album: Album, @Ctx() _ctx: GqlContext) {
    return album.artist;
  }
}
