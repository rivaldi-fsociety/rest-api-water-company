import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from "App/Models/Role"
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RolesController {

    public async index({ response }:HttpContextContract)
    {
        const role = await Role.query().where('is_active', '=', true).orderBy('id', 'desc')

        return response.status(200).json(role)
    }

    public async show()
    {
        
    }

    public async store({ request, response }:HttpContextContract)
    {
        try {
            const validationSchema = schema.create({
                name: schema.string({ trim: true }, [
                    rules.maxLength(30)
                ]),
                description: schema.string({ trim: true }, [
                    rules.maxLength(255)
                ]),
            })
            
            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'name.required': 'Role Name is Required',
                    'name.maxLength': 'Role Name length cannot exceed 30 character',
                    'description.maxLength': 'Description length cannot exceed 255 character',
                }
            })
    
            const newRole = await Role.create(validatedData)

            return response.status(200).json({
                newRole
            })
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

    public async update()
    {
        
    }

    public async delete()
    {
        
    }

}
