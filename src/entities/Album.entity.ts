import { Collection, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from './base.entity';

import { Artist } from '.';

@ObjectType()
@Entity()
export class Album extends BaseEntity {
  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  releaseDate: Date;

  @Field(() => Artist)
  @ManyToOne({ entity: 'Artist' })
  artist = new Collection<Artist>(this);
}
