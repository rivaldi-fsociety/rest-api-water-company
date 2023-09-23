import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import Officer from 'App/Models/Officer'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'
import Database from '@ioc:Adonis/Lucid/Database'

export default class OfficersController {

    public async index({ response }: HttpContextContract)
    {
        const officer = await Officer.query().where('is_active', '=', true).orderBy('id', 'desc').preload('account').preload('role')

        return response.status(200).json(officer)
    }

    public async store({ request, response }: HttpContextContract)
    {
        try {
            const rolesData = await Role.query().where('is_active', '=', true).orderBy('id', 'desc').first()

            if(rolesData){
                const validationAccountSchema = schema.create({
                    full_name: schema.string({ trim: true }, [
                        rules.maxLength(30)
                    ])
                })
    
                const validationOfficerSchema = schema.create({
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
                        rules.range(2, rolesData?.id),
                    ])
                })

                const validatedAccountSchema = await request.validate({
                    schema: validationAccountSchema,
                    messages: {
                        'full_name.required': 'Fullname is Required',
                        'full_name.maxLength': 'Fullname length cannot exceed 30 character'
                    }
                })
                
                const validatedOfficerSchema = await request.validate({
                    schema: validationOfficerSchema,
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
                        'roleId.range': 'Role ID must between 2 and ' + rolesData?.id,
                    }
                })

                const result = await Database.transaction(async (trx) => {
                    const newAccount = new Account()
                    newAccount.$attributes = validatedAccountSchema
                    
                    newAccount.useTransaction(trx)
                    const account = await newAccount.save()
    
                    const newOfficer = new Officer()
                    newOfficer.$attributes = validatedOfficerSchema
                    newOfficer.accountId = newAccount.id
                    newOfficer.roleId = validateRole.roleId
                    
                    newOfficer.useTransaction(trx)
                    const officer = await newOfficer.save()
    
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
