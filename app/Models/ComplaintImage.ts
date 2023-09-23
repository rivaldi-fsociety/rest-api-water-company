import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import ComplaintIssue from './ComplaintIssue'

export default class ComplaintImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public complaint_id: number

  @belongsTo(() => ComplaintIssue)
  public complaint: BelongsTo<typeof ComplaintIssue>

  @column()
  public filename: string

  @column()
  public is_primary: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  @column()
  public is_active: boolean

  @column()
  public is_deleted: boolean
}
