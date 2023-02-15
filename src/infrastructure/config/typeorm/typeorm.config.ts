import { ConnectionOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: './env/local.env' });
}
if (process.env.NODE_ENV === 'teste') {
  dotenv.config({ path: './env/teste.env' });
}

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + './../../migrations/*{.ts,.js}'],
});

export default datasource;
