import { DataSource } from 'typeorm';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

console.log(configService.get('DB_HOST'));
console.log(configService.get('DB_PORT'));
console.log(configService.get('DB_USERNAME'));
console.log(configService.get('DB_PASSWORD'));
console.log(configService.get('DB_NAME'));

export const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '/../**/*.entity.ts'],
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*.ts'],
});
