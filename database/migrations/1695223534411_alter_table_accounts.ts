import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_active').nullable().defaultTo(true)
      table.boolean('is_deleted').nullable().defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
