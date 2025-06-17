import { Migration } from '@mikro-orm/migrations';

export class Migration20250616210420 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "artist" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "start_year" int not null, "end_year" int null, constraint "artist_pkey" primary key ("uuid"));`,
    );

    this.addSql(
      `create table "album" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "release_date" timestamptz not null, "artist_uuid" uuid not null, constraint "album_pkey" primary key ("uuid"));`,
    );

    this.addSql(
      `create table "member" ("uuid" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "full_name" varchar(255) not null, constraint "member_pkey" primary key ("uuid"));`,
    );

    this.addSql(
      `create table "artist_members" ("artist_uuid" uuid not null, "member_uuid" uuid not null, constraint "artist_members_pkey" primary key ("artist_uuid", "member_uuid"));`,
    );

    this.addSql(
      `alter table "album" add constraint "album_artist_uuid_foreign" foreign key ("artist_uuid") references "artist" ("uuid") on update cascade;`,
    );

    this.addSql(
      `alter table "artist_members" add constraint "artist_members_artist_uuid_foreign" foreign key ("artist_uuid") references "artist" ("uuid") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "artist_members" add constraint "artist_members_member_uuid_foreign" foreign key ("member_uuid") references "member" ("uuid") on update cascade on delete cascade;`,
    );
  }
}
