import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class OfficersController {

    public async index({ response }: HttpContextContract)
    {
        const officer = await User.query().where('is_active', '=', true).andWhereIn('roleId', [3,4,5,6]).orderBy('id', 'desc').preload('account').preload('role')

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

}
