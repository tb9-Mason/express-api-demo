import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/postgresql';

import { Album, Artist, Member } from './entities';

export interface Services {
  em: EntityManager;
  orm: MikroORM;
  artistRepo: EntityRepository<Artist>;
  albumRepo: EntityRepository<Album>;
  memberRepo: EntityRepository<Member>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  return (cache = {
    orm,
    em: orm.em,
    artistRepo: orm.em.getRepository(Artist),
    albumRepo: orm.em.getRepository(Album),
    memberRepo: orm.em.getRepository(Member),
  });
}
