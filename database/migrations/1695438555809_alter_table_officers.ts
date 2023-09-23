import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'officers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username', 30).notNullable().unique()
      table.string('email', 30).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
