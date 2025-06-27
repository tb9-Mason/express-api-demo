import { Migration } from '@mikro-orm/migrations';

export class Migration20250627164854 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "album" add column "static_rating" numeric(3,1) not null, add column "user_rating_total" int not null default 0, add column "num_ratings" int not null default 0;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "album" drop column "static_rating", drop column "user_rating_total", drop column "num_ratings";`,
    );
  }
}
