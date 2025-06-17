import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

import { Artist } from '.';

@Entity()
export class Member extends BaseEntity {
  @Property()
  fullName: string;

  @ManyToMany({ mappedBy: 'members', entity: 'Artist' })
  artists = new Collection<Artist>(this);
}
