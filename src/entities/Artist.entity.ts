import { Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from './base.entity';

import { Album, Member } from '.';

@ObjectType()
@Entity()
export class Artist extends BaseEntity {
  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  startYear: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  endYear?: number;

  @Field(() => [Member])
  @ManyToMany({ entity: 'Member' })
  members = new Collection<Member>(this);

  @Field(() => [Album])
  @OneToMany(() => Album, (album) => album.artist)
  albums = new Collection<Album>(this);
}
