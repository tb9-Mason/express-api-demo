import { readFileSync } from 'fs';
import { join } from 'path';

import { parse } from '@fast-csv/parse';
import type { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Album, Artist, Member } from '../entities';

interface AlbumRow {
  name: string;
  releaseDate: string;
  rating: number;
  artistId: number;
  link: string;
}

interface ArtistRow {
  name: string;
  startYear: number;
  endYear: number;
  artistId: number;
}

interface MemberRow {
  fullName: string;
  artistId: string;
}

interface ArtistId {
  artistId: number;
}

const artistById: Record<number, Artist> = {};

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const artistCsv = readFileSync(join(__dirname, '/seed-files/artists.csv'));
    let promise = new Promise((resolve, reject) => {
      const stream = parse<ArtistRow, RequiredEntityData<Artist> & ArtistId>({ headers: true })
        .transform(async (data, cb) => {
          cb(null, {
            artistId: data.artistId,
            name: data.name,
            startYear: data.startYear,
            endYear: data.endYear ? data.endYear : null,
          });
        })
        .on('error', (error) => reject(error))
        .on('data', async (row: RequiredEntityData<Artist> & ArtistId) => {
          // Store the artiest with their CSV ID to assign to albums and members in the next steps
          artistById[row.artistId] = em.create(Artist, {
            name: row.name,
            startYear: row.startYear,
            endYear: row.endYear,
          });
        })
        .on('end', (rowCount: number) => resolve(rowCount));
      stream.write(artistCsv);
      stream.end();
    });

    try {
      const rows = await promise;
      for (const id in artistById) {
        // Loop over csv IDs and persist each artist
        em.persist(artistById[id]);
      }
      console.log(`Artists: ${rows} parsed`);
      await em.flush();
    } catch (e) {
      console.error(e);
    }

    const albumCsv = readFileSync(join(__dirname, '/seed-files/albums.csv'));
    promise = new Promise((resolve, reject) => {
      const stream = parse<AlbumRow, RequiredEntityData<Album>>({ headers: true })
        .transform(async (data, cb) => {
          cb(null, {
            // Assign the artist by the CSV ID
            artist: artistById[data.artistId],
            name: data.name,
            releaseDate: new Date(data.releaseDate),
            staticRating: data.rating,
            link: data.link,
          });
        })
        .on('error', (error) => reject(error))
        .on('data', async (row: RequiredEntityData<Album>) => {
          em.persist(em.create(Album, row));
        })
        .on('end', (rowCount: number) => resolve(rowCount));
      stream.write(albumCsv);
      stream.end();
    });

    try {
      const rows = await promise;
      console.log(`Albums: ${rows} parsed`);
      await em.flush();
    } catch (e) {
      console.error(e);
    }

    const memberCsv = readFileSync(join(__dirname, '/seed-files/members.csv'));
    promise = new Promise((resolve, reject) => {
      const stream = parse<MemberRow, RequiredEntityData<Member>>({ headers: true })
        .transform(async (data, cb) => {
          cb(null, {
            // Assign the artist by the CSV ID
            artists: data.artistId.split(',').map((id) => artistById[parseInt(id)]),
            fullName: data.fullName,
          });
        })
        .on('error', (error) => reject(error))
        .on('data', async (row: RequiredEntityData<Member>) => {
          em.persist(em.create(Member, row));
        })
        .on('end', (rowCount: number) => resolve(rowCount));
      stream.write(memberCsv);
      stream.end();
    });

    try {
      const rows = await promise;
      console.log(`Members: ${rows} parsed`);
      await em.flush();
    } catch (e) {
      console.error(e);
    }
  }
}
