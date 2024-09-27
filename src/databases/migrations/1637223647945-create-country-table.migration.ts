import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCountryTable1637223647945 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "Country" (
                "id" uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY, 
                "name" character varying DEFAULT NULL
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Country";`);
    }
}
