import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteInactiveUsers1695890355238 implements MigrationInterface {
  name = 'DeleteInactiveUsers1695890355238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION DeleteInactiveUsersProcedure()
      RETURNS VOID AS $$
      BEGIN
        DELETE FROM users WHERE isActive = false;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS DeleteInactiveUsersProcedure() CASCADE',
    );
  }
}
