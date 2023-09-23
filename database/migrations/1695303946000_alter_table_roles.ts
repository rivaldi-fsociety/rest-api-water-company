import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').alter()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
