import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql';

import { Artist, Member } from '../../entities';
import { GqlContext } from '../gql-server';
import fieldsToRelations from '../utilities/fields-to-relations';

@Resolver((_of) => Member)
export class MemberResolver {
  @Query((_returns) => Member, { nullable: true })
  member(@Arg('id', (_type) => String) id: string, @Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Member>(info, Member, em);
    return em.findOneOrFail(Member, id, { populate: relations });
  }

  @Query((_returns) => [Member!]!)
  members(@Ctx() { em }: GqlContext, @Info() info: GraphQLResolveInfo) {
    const relations = fieldsToRelations<Member>(info, Member, em);
    return em.findAll(Member, { populate: relations });
  }

  @FieldResolver((_returns) => [Artist!]!)
  async artists(@Root() member: Member, @Ctx() _ctx: GqlContext) {
    return member.artists;
  }
}
