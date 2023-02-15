import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class despesasMigration1676267489639 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'despesas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'descricao',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'valor',
            type: 'decimal',
            isNullable: false,
            precision: 10,
            scale: 2,
          },
          {
            name: 'data',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: null,
            isNullable: true,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            default: null,
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    queryRunner.clearSqlMemory();

    const foreignKey = new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('despesas', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('despesas');
  }
}
