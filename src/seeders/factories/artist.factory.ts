import { faker } from '@faker-js/faker';
import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';

import { Artist } from '../../entities';

export class ArtistFactory extends Factory<Artist> {
  model = Artist;

  definition(): EntityData<Artist> {
    const startYear = faker.date.between({ from: '1970-01-01', to: '2025-01-01' }).getFullYear();
    let endYear = null;
    if (Math.round(Math.random())) {
      // Conditionally get an end year that is after the start year
      endYear = faker.date.between({ from: `${startYear}-01-01`, to: '2025-01-01' }).getFullYear();
    }
    return {
      name: faker.music.artist(),
      startYear,
      endYear,
    };
  }
}
