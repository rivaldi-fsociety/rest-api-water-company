import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Account from './Account';
import Role from './Role';
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column({ columnName: 'roleId' })
  public roleId: number

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @column({ columnName: 'account_id' })
  public accountId: number

  @belongsTo(() => Account)
  public account: BelongsTo<typeof Account>

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public remember_me_token: string

  @column()
  public is_officer: boolean

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

  @beforeCreate()
  public static async addUidHook(user: User) {
    user.uuid = uuidv4();
  }

  @beforeSave()
  public static async hashPassword(user: User){
    if(user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
  }
}
