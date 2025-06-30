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

  @Field()
  @Property()
  link: string;

  @Field()
  @Property({ type: 'float', columnType: 'numeric(3,1)' })
  staticRating: number;

  @Field()
  @Property({ default: 0 })
  userRatingTotal: number;

  @Field()
  @Property({ default: 0 })
  numRatings: number;
}
