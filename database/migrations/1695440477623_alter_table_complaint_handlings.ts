import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaint_handlings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('status_id').unsigned().notNullable().references('complaint_statuses.id').onDelete('CASCADE').onUpdate('RESTRICT')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
