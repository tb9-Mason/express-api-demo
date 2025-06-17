import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Artist } from 'src/entities';

import { AlbumFactory, ArtistFactory, MemberFactory } from './factories';

const ALBUM_MIN = 1;
const ALBUM_MAX = 10;
const MEMBER_MIN = 2;
const MEMBER_MAX = 6;

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const artists: Artist[] = await new ArtistFactory(em).create(50);
    // Create albums and members for the artist based on the constant min and max values
    const numAlbums = Math.floor(Math.random() * (ALBUM_MAX - ALBUM_MIN + 1) + ALBUM_MIN);
    const numMembers = Math.floor(Math.random() * (MEMBER_MAX - MEMBER_MIN + 1) + MEMBER_MIN);
    artists.forEach((artist) => {
      artist.members.set(new MemberFactory(em).make(numMembers));
      // Pass the artist to the albums factories to use the release date
      artist.albums.set(new AlbumFactory(em).make(numAlbums, { artist }));
    });
  }
}
