import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableAccounts1722523780696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: "accounts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
        ],
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
