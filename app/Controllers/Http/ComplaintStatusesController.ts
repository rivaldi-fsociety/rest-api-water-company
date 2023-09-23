import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ComplaintStatus from "App/Models/ComplaintStatus"

export default class ComplaintStatusesController {

    public async index({ response }: HttpContextContract)
    {
        const complaintStatus = await ComplaintStatus.query().where('is_active', '=', true).orderBy('id', 'desc')

        return response.status(200).json(complaintStatus)
    }

    public async store({ request, response }: HttpContextContract)
    {
        try {
            const validationSchema = schema.create({
                status_name: schema.string({ trim: true }, [
                    rules.maxLength(50)
                ])
            })
    
            const validatedStatus = await request.validate({
                schema: validationSchema,
                messages: {
                    'status_name.required': 'Status Name is Required',
                    'status_name.maxLength': 'Status Name length cannot exceed 50 character'
                }
            })
    
            const newStatus = await ComplaintStatus.create(validatedStatus)
    
            return response.status(200).json({
                status: newStatus
            })
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

}
