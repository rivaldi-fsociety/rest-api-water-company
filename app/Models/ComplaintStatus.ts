import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ComplaintStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status_name: string

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
