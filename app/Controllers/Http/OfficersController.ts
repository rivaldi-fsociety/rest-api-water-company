import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
export default class OfficersController {

    public async index({ response }: HttpContextContract)
    {
        const officer = await User.query().where('is_active', '=', true).andWhere('is_officer', true).orderBy('id', 'desc').preload('account').preload('role')

        return response.status(200).json(officer)
    }

    public async store({ auth, request, response }: HttpContextContract)
    {
        try {
            const user = await auth.use('jwt').authenticate()
            const rolesData = await Role.query().where('is_active', '=', true).orderBy('id', 'desc').first()

            if(rolesData){
                const validationAccountSchema = schema.create({
                    full_name: schema.string({ trim: true }, [
                        rules.maxLength(30)
                    ])
                })
    
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

                const validationRoleSchema = schema.create({
                    roleId: schema.number([
                        rules.range(3, rolesData?.id),
                    ])
                })

                const validatedAccountSchema = await request.validate({
                    schema: validationAccountSchema,
                    messages: {
                        'full_name.required': 'Fullname is Required',
                        'full_name.maxLength': 'Fullname length cannot exceed 30 character'
                    }
                })
                
                const validatedUserSchema = await request.validate({
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

                const validateRole = await request.validate({
                    schema: validationRoleSchema,
                    messages: {
                        'roleId.required': 'Role is Required',
                        'roleId.range': 'Role ID must between 3 and ' + rolesData?.id,
                    }
                })

                const result = await Database.transaction(async (trx) => {
                    const newAccount = new Account()
                    newAccount.$attributes = validatedAccountSchema
                    newAccount.createdBy = user.id
                    newAccount.updatedBy = user.id
                    
                    newAccount.useTransaction(trx)
                    const account = await newAccount.save()
    
                    const newUser = new User()
                    newUser.$attributes = validatedUserSchema
                    newUser.accountId = newAccount.id
                    newUser.roleId = validateRole.roleId
                    newUser.createdBy = user.id
                    newUser.is_officer = true
                    
                    newUser.useTransaction(trx)
                    const officer = await newUser.save()
    
                    trx.commit()
                    return {
                        officer: officer,
                        account: account
                    }
                })
    
                return response.status(200).json({
                    result
                })
            }else{
                return response.badRequest('Master Data Role is Empty')
            }
    
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

    public async show({ response, params }: HttpContextContract)
    {
        const data = await User.query().where('is_active', '=', true).andWhere('is_officer', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"Officer Not Found."})
        }
        return response.status(200).json(data)
    }

    public async update({ auth, request, response, params }: HttpContextContract){
        const user = await auth.use('jwt').authenticate()
        const data = await User.query().where('is_active', '=', true).andWhere('is_officer', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"Officer Not Found."})
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
        const data = await User.query().where('is_active', '=', true).andWhere('is_officer', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"Officer Not Found."})
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
        const data = await User.query().andWhere('is_officer', true).andWhere('id', params.id).preload('account').preload('role').first()
        if(!data){
            return response.status(400).json({message:"Officer Not Found."})
        }
        
        data.is_active = true
        data.is_deleted = false
        data.updatedBy = user.id

        await data.save()

        return response.status(200).json(data)
    }

}
