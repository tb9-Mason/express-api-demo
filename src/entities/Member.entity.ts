import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from './base.entity';

import { Artist } from '.';

@ObjectType()
@Entity()
export class Member extends BaseEntity {
  @Field()
  @Property()
  fullName: string;

  @Field(() => [Artist])
  @ManyToMany({ mappedBy: 'members', entity: 'Artist' })
  artists = new Collection<Artist>(this);
}
