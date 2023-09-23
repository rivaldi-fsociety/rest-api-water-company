import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ComplaintHandling from 'App/Models/ComplaintHandling'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class ComplaintHandlingsController {

    public async index({ response }: HttpContextContract)
    {
        const complaintHandling = await ComplaintHandling.query().where('is_active', '=', true).orderBy('id', 'desc').preload('user').preload('complaint_issue').preload('complaint_status')

        return response.status(200).json(complaintHandling)
    }

    public async update({ auth, request, response, params }: HttpContextContract)
    {
        try {
            const user = await auth.use('jwt').authenticate()
            const data = await ComplaintHandling.find(params.id)
            if(!data){
                return response.badRequest({
                    error: "Complaint Data Not Found"
                })
            }

            const validationSchema = schema.create({
                officer_id: schema.number(),
                status_id: schema.number([
                    rules.range(1, 5)
                ]),
                notes: schema.string.optional()
            })

            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'officer_id.required': 'Officer is Required',
                    'status_id.required': 'Status is Required',
                }
            })

            const officerData = await User.query().where('is_active', '=', true).andWhere('id', '=', validatedData.officer_id).andWhere('is_officer', true).first()
            if(!officerData){
                return response.badRequest({
                    error: `Officer Not Found.`
                })
            }
            const roleOfficerId = [2,3,5]
            const canBeAssignee = roleOfficerId.indexOf(officerData.$attributes.roleId)
            if(!canBeAssignee){
                return response.badRequest({
                    error: 'Officers have no roles to assign'
                })
            }

            data.userId = validatedData.officer_id
            data.complaintStatusId = validatedData.status_id
            if(validatedData.notes){
                data.notes = validatedData.notes
            }
            data.updatedBy = user.id

            await data.save()

            return response.status(200).json({
                result: data
            })
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

}
