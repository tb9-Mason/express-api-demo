import { Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

import { Album, Member } from '.';

@Entity()
export class Artist extends BaseEntity {
  @Property()
  name: string;

  @Property()
  startYear: number;

  @Property({ nullable: true })
  endYear?: number;

  @ManyToMany({ entity: 'Member' })
  members = new Collection<Member>(this);

  @OneToMany(() => Album, (album) => album.artist)
  albums = new Collection<Album>(this);
}
