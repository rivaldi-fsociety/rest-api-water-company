import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CategoriesController {

    public async index({ response }: HttpContextContract)
    {
        const category = await Category.query().where('is_active', '=', true).orderBy('id', 'desc')

        return response.status(200).json(category)
    }

    public async store({ request, response }: HttpContextContract)
    {
        try {
            const validationSchema = schema.create({
                name: schema.string({ trim: true }, [
                    rules.maxLength(100)
                ]),
                class: schema.string({ trim: true }, [
                    rules.maxLength(100)
                ]),
            })

            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'name.required': 'Name is Required',
                    'name.maxLength': 'Name length cannot exceed 100 character',
                    'class.required': 'Class is Required',
                    'class.maxLength': 'Class length cannot exceed 100 character',
                }
            })

            const newCategory = await Category.create(validatedData)

            return response.status(200).json({
                category: newCategory
            })
    
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

}
