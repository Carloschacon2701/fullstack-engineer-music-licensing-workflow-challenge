import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1763119977840 implements MigrationInterface {
  name = 'FirstMigration1763119977840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Movie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Scene\` (\`id\` int NOT NULL AUTO_INCREMENT, \`movie_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Song\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`artist\` varchar(255) NOT NULL, \`genre\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`License_Status_History\` (\`id\` int NOT NULL AUTO_INCREMENT, \`license_id\` int NOT NULL, \`status_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`License\` (\`id\` int NOT NULL AUTO_INCREMENT, \`track_id\` int NOT NULL, \`status_id\` int NOT NULL, UNIQUE INDEX \`IDX_b72ab4b8c153c252e556f2712d\` (\`track_id\`), UNIQUE INDEX \`REL_b72ab4b8c153c252e556f2712d\` (\`track_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Track\` (\`id\` int NOT NULL AUTO_INCREMENT, \`scene_id\` int NOT NULL, \`song_id\` int NOT NULL, \`start_time_seconds\` int NOT NULL, \`end_time_seconds\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Scene\` ADD CONSTRAINT \`FK_cbd1b6c1ce58f02be4fe07617e0\` FOREIGN KEY (\`movie_id\`) REFERENCES \`Movie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`License_Status_History\` ADD CONSTRAINT \`FK_06817592d6555445c4a7b0e4ed2\` FOREIGN KEY (\`license_id\`) REFERENCES \`License\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`License_Status_History\` ADD CONSTRAINT \`FK_845ab0e220f5f4342d1c2afeeda\` FOREIGN KEY (\`status_id\`) REFERENCES \`Status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`License\` ADD CONSTRAINT \`FK_b72ab4b8c153c252e556f2712da\` FOREIGN KEY (\`track_id\`) REFERENCES \`Track\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`License\` ADD CONSTRAINT \`FK_151114faaa1229810967d554d4f\` FOREIGN KEY (\`status_id\`) REFERENCES \`Status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Track\` ADD CONSTRAINT \`FK_4f705f9d2d6ac472df71310a413\` FOREIGN KEY (\`scene_id\`) REFERENCES \`Scene\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Track\` ADD CONSTRAINT \`FK_935bdce77c8e8db5c3f7bc22604\` FOREIGN KEY (\`song_id\`) REFERENCES \`Song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Track\` DROP FOREIGN KEY \`FK_935bdce77c8e8db5c3f7bc22604\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Track\` DROP FOREIGN KEY \`FK_4f705f9d2d6ac472df71310a413\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`License\` DROP FOREIGN KEY \`FK_151114faaa1229810967d554d4f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`License\` DROP FOREIGN KEY \`FK_b72ab4b8c153c252e556f2712da\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`License_Status_History\` DROP FOREIGN KEY \`FK_845ab0e220f5f4342d1c2afeeda\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`License_Status_History\` DROP FOREIGN KEY \`FK_06817592d6555445c4a7b0e4ed2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Scene\` DROP FOREIGN KEY \`FK_cbd1b6c1ce58f02be4fe07617e0\``,
    );
    await queryRunner.query(`DROP TABLE \`Track\``);
    await queryRunner.query(
      `DROP INDEX \`REL_b72ab4b8c153c252e556f2712d\` ON \`License\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b72ab4b8c153c252e556f2712d\` ON \`License\``,
    );
    await queryRunner.query(`DROP TABLE \`License\``);
    await queryRunner.query(`DROP TABLE \`Status\``);
    await queryRunner.query(`DROP TABLE \`License_Status_History\``);
    await queryRunner.query(`DROP TABLE \`Song\``);
    await queryRunner.query(`DROP TABLE \`Scene\``);
    await queryRunner.query(`DROP TABLE \`Movie\``);
  }
}
