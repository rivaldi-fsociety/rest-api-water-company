import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
    public index({response}:HttpContextContract){
        return response.status(200).json('Login Page')
    }
}