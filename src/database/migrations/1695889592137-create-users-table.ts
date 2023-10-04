import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { TABLES } from '@src/utils/constants';

export class CreateUsersTable1695889592137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.users,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'character varying',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'character varying',
          },
          {
            name: 'lastName',
            type: 'character varying',
          },
          {
            name: 'password',
            type: 'character varying',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'TIMESTAMP WITH TIME ZONE',
            default: 'now()',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'TIMESTAMP WITH TIME ZONE',
            default: 'now()',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLES.users);
  }
}
