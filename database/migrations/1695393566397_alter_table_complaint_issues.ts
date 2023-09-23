import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'complaint_issues'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('images_id').unsigned().notNullable().references('complaint_images.id').onDelete('CASCADE').onUpdate('RESTRICT')
      table.integer('meteran_id').unsigned().notNullable().references('meterans.id').onDelete('CASCADE').onUpdate('RESTRICT')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
