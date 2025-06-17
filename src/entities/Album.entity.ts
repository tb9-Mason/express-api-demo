import { Collection, Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

import { Artist } from '.';

@Entity()
export class Album extends BaseEntity {
  @Property()
  name: string;

  @Property()
  releaseDate: Date;

  @ManyToOne({ entity: 'Artist' })
  artist = new Collection<Artist>(this);
}
