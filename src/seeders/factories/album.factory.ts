import { faker } from '@faker-js/faker';
import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';

import { Album, Artist } from '../../entities';

export class AlbumFactory extends Factory<Album> {
  model = Album;

  definition(input?: EntityData<Album>): EntityData<Album> {
    return {
      name: faker.music.album(),
      // Use the assigned artist's year for a realistic release date
      releaseDate: faker.date.between({ from: `${(input.artist as Artist).startYear}-01-01`, to: '2025-01-01' }),
    };
  }
}
