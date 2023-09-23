import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegistersController {
    public index({ response }:HttpContextContract){
        return response.status(200).json('Register Page')
    }
}
