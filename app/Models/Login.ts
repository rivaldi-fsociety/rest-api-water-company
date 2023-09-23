import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Login extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public uuid: string
  
  @column()
  public roleId: number
  
  @column()
  public account_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
