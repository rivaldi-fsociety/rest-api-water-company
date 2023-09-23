import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AccountsController {
    public async index({ response }:HttpContextContract){
        const account = await Account.query().where('is_active', '=', true).orderBy('id', 'desc')

        return response.status(200).json(account)
    }

    public async show({ response, params }: HttpContextContract)
    {
        const data = await Account.findOrFail(params.id)
        return response.status(200).json(data)
    }

    public async update({ request, response, params }: HttpContextContract){
        const data = await Account.findOrFail(params.id)

        const validationSchema = schema.create({
            full_name: schema.string({ trim: true }, [
                rules.maxLength(30)
            ])
        })
        
        const validatedData = await request.validate({
            schema: validationSchema,
            messages: {
                'full_name.required': 'Fullname is Required',
                'full_name.maxLength': 'Fullname length cannot exceed 30 character'
            }
        })

        /** Update Process */
        data.full_name = validatedData?.full_name

        await data.save()

        return response.status(200).json(data)
    }

    public async delete({ response, params }: HttpContextContract)
    {
        const data = await Account.findOrFail(params.id)

        data.is_active = false
        data.is_deleted = true
        data.deleted_at = DateTime.local()

        await data.save()

        return response.status(200).json(data)
    }

    public async activate({ response, params }: HttpContextContract)
    {
        const data = await Account.findOrFail(params.id)
        
        data.is_active = true
        data.is_deleted = false

        await data.save()

        return response.status(200).json(data)
    }
}