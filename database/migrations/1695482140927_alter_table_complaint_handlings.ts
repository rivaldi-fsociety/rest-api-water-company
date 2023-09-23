import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaint_handlings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.index('complaint_id', 'complaint_id_idx')
      table.index('user_id', 'user_id_idx')
      table.index('status_id', 'status_id_idx')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
