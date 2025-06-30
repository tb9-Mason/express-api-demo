import { Migrator } from '@mikro-orm/migrations';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const OrmConfig: Options = {
  driver: PostgreSqlDriver,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    tableName: 'migrations',
    transactional: true,
    disableForeignKeys: false,
  },
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  highlighter: new SqlHighlighter(),
  extensions: [Migrator, SeedManager],
};

if (process.env.DATABASE_URL) {
  OrmConfig.clientUrl = process.env.DATABASE_URL;
} else {
  OrmConfig.user = process.env.MIKRO_ORM_USER;
  OrmConfig.password = process.env.MIKRO_ORM_PASSWORD;
  OrmConfig.dbName = process.env.MIKRO_ORM_DB_NAME;
  OrmConfig.host = process.env.MIKRO_ORM_HOST;
  OrmConfig.port = parseInt(process.env.MIKRO_ORM_PORT);
  OrmConfig.schema = process.env.MIKRO_ORM_SCHEMA;
}

export default OrmConfig;
