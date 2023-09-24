import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class UsersController {

    public async index({ response }:HttpContextContract)
    {
        const user = await User.query().where('is_active', '=', true).orderBy('id', 'desc').preload('account').preload('role')

        return response.status(200).json(user)
    }

    public async show({ response, params }: HttpContextContract)
    {
        const data = await User.query().where('is_active', '=', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"User Not Found."})
        }
        return response.status(200).json(data)
    }

    public async update({ auth, request, response, params }: HttpContextContract){
        const user = await auth.use('jwt').authenticate()
        const data = await User.query().andWhere('is_active', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"User Not Found."})
        }

        const validationUserSchema = schema.create({
            username: schema.string({ trim: true }, [
                rules.maxLength(30),
                rules.unique({ table:"users", column:"username" })
            ]),
            email: schema.string({ trim: true }, [
                rules.email(),
                rules.maxLength(30),
                rules.unique({ table:"users", column:"email" })
            ]),
            password: schema.string({ trim: true }, [
                rules.maxLength(50)
            ])
        })
        
        const validatedUser = await request.validate({
            schema: validationUserSchema,
            messages: {
                'username.required': 'Username is Required',
                'username.maxLength': 'Username length cannot exceed 30 character',
                'email.required': 'Email is Required',
                'email.maxLength': 'Email length cannot exceed 30 character',
                'password.required': 'Password is Required',
                'password.maxLength': 'Password length cannot exceed 50 character',
            }
        })

        /** Update Process */
        data.username = validatedUser?.username
        data.email = validatedUser?.email
        data.password = validatedUser?.password
        data.updatedBy = user.id

        await data.save()

        return response.status(200).json(data)
    }

    public async delete({ auth, response, params }: HttpContextContract)
    {
        const user = await auth.use('jwt').authenticate()
        const data = await User.query().andWhere('is_active', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"User Not Found."})
        }

        data.is_active = false
        data.is_deleted = true
        data.deleted_at = DateTime.local()
        data.deletedBy = user.id

        await data.save()

        return response.status(200).json(data)
    }

    public async activate({ auth, response, params }: HttpContextContract)
    {
        const user = await auth.use('jwt').authenticate()
        const data = await User.query().andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"User Not Found."})
        }
        
        data.is_active = true
        data.is_deleted = false
        data.updatedBy = user.id

        await data.save()

        return response.status(200).json(data)
    }
}
