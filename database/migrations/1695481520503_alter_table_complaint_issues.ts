import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaint_issues'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.index('user_id', 'user_id_idx')
      table.index('category_id', 'category_id_idx')
      table.index('complaint_name', 'complaint_name_idx')
      table.index('priority_level', 'priority_level_idx')
      table.index('images_id', 'images_id_idx')
      table.index('meteran_id', 'meteran_id_idx')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
