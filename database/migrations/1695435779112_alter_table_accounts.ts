import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('username','email','password','remember_me_token')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
