import { Migration } from '@mikro-orm/migrations';

export class Migration20250630161704 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "album" add column "link" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "album" drop column "link";`);
  }
}
