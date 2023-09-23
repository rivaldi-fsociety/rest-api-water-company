import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaint_handlings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE').onUpdate('RESTRICT').alter()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
