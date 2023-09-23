import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaint_handlings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('created_by').notNullable()
      table.integer('updated_by').notNullable()
      table.integer('deleted_by').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
