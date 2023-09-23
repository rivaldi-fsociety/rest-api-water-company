import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Category from './Category'
import ComplaintImage from './ComplaintImage'
import Meteran from './Meteran'

export default class ComplaintIssue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public category_id: number

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @column()
  public images_id: number

  @belongsTo(() => ComplaintImage)
  public images: BelongsTo<typeof ComplaintImage>

  @column()
  public meteran_id: number

  @belongsTo(() => Meteran)
  public meteran: BelongsTo<typeof Meteran>

  @column()
  public complaint_name: string

  @column()
  public short_description: string

  @column()
  public priority_level: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  @column({ columnName: 'created_by' })
  public createdBy: number

  @column({ columnName: 'updated_by' })
  public updatedBy: number

  @column({ columnName: 'deleted_by' })
  public deletedBy: number

  @column()
  public is_active: boolean

  @column()
  public is_deleted: boolean
}
