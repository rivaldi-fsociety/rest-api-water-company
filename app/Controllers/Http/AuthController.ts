import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {

    public async register({ request, response }: HttpContextContract)
    {
        try {
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
            
            const validatedAccount = await request.validate({
                schema: validationAccountSchema,
                messages: {
                    'full_name.required': 'Fullname is Required',
                    'full_name.maxLength': 'Fullname length cannot exceed 30 character',
                }
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

            const result = await Database.transaction(async (trx) => {
                const newAccount = new Account()
                newAccount.$attributes = validatedAccount
                
                newAccount.useTransaction(trx)
                const account = await newAccount.save()

                const newUser = new User()
                newUser.$attributes = validatedUser
                newUser.accountId = newAccount.id
                newUser.roleId = 2
                
                newUser.useTransaction(trx)
                const user = await newUser.save()

                trx.commit()
                return {
                    user: user,
                    account: account
                }
            })

            return response.status(200).json({
                result
            })
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

    public async login({ auth, response, request })
    {
        try {
            const { email, password } = request.body()
            const user = await User.query().where('email', email).where('is_active', true).first()

            if(!user){
                return response.badRequest({error:'Email is not registered.'})
            }

            if (!(await Hash.verify(user.password, password))) {
                return response.badRequest({error:'Invalid Email or Password.'})
            }
            const jwt = auth.use("jwt").generate(user)
            
            return jwt
        } catch (error) {
            return response.status(500).json({
                error,
                messages: error.messages ? error.messages : 'error'
            })
        }
    }

    public async logout()
    {

    }

}
