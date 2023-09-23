import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import ComplaintIssue from './ComplaintIssue'
// import Officer from './Officer'
import ComplaintStatus from './ComplaintStatus'
import User from './User'

export default class ComplaintHandling extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'complaint_id' })
  public complaintIssueId: number

  @belongsTo(() => ComplaintIssue)
  public complaint_issue: BelongsTo<typeof ComplaintIssue>

  @column({ columnName: 'user_id' })
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column({ columnName: 'status_id' })
  public complaintStatusId: number

  @belongsTo(() => ComplaintStatus)
  public complaint_status: BelongsTo<typeof ComplaintStatus>

  @column()
  public notes: string

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
