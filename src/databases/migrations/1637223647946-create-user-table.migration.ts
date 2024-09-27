import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1637223647946 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "User" (
                "id" uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY, 
                "email" character varying NOT NULL, 
                "name" character varying DEFAULT NULL, 
                "countryId" uuid NOT NULL REFERENCES "Country"(id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User";`);
    }
}
