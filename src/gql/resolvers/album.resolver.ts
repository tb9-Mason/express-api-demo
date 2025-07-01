import { Max, Min } from 'class-validator';
import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, Field, FieldResolver, Float, Info, InputType, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Album, Artist } from '../../entities';
import { GqlContext } from '../gql-server';
import fieldsToRelations from '../utilities/fields-to-relations';

@InputType({ description: 'User rating update parameters' })
class UpdateUserRatingInput {
  @Field()
  uuid: string;

  @Field()
  @Min(1)
  @Max(5)
  rating: number;
}

@Resolver((_of) => Album)
export class AlbumResolver {
  @Query((_returns) => Album, { nullable: true })
  album(@Arg('id', (_type) => String) id: string, @Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Album>(info, Album, em);
    return em.findOneOrFail(Album, id, { populate: relations });
  }

  @Query((_returns) => [Album!]!)
  albums(@Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Album>(info, Album, em);
    return em.findAll(Album, { populate: relations });
  }

  @Mutation((_returns) => Album)
  async updateUserRating(@Arg('data') { uuid, rating }: UpdateUserRatingInput, @Ctx() { em }: GqlContext) {
    const album = await em.findOneOrFail(Album, { uuid });

    album.userRatingTotal += rating;
    album.numRatings++;

    await em.persistAndFlush(album);

    return album;
  }

  @FieldResolver((_returns) => Artist)
  async artist(@Root() album: Album, @Ctx() _ctx: GqlContext) {
    return album.artist;
  }

  @FieldResolver((_returns) => Float)
  userRating(@Root() album: Album, @Ctx() _ctx: GqlContext) {
    let userRating = 0;
    if (album.numRatings > 0) {
      // Multiply the rounded average rating by 10, then divide by 10 to produce a
      // number with a single decimal point
      userRating = Math.round((album.userRatingTotal / album.numRatings) * 10) / 10;
    }

    return userRating;
  }
}
