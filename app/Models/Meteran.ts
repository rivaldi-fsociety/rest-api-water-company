import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Meteran extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public meteran_code: string

  @column()
  public address: string

  @column()
  public lat: number

  @column()
  public long: number

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
