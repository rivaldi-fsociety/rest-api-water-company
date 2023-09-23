import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {

    public async index({ response }:HttpContextContract)
    {
        const user = await User.query().where('is_active', '=', true).orderBy('id', 'desc').preload('account').preload('role')

        return response.status(200).json(user)
    }

}
