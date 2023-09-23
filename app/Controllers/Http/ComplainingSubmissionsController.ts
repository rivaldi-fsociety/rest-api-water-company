import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ComplaintIssue from 'App/Models/ComplaintIssue'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ComplaintImage from 'App/Models/ComplaintImage'
import Meteran from 'App/Models/Meteran'
import axios from 'axios'
import Database from '@ioc:Adonis/Lucid/Database'
import ComplaintHandling from 'App/Models/ComplaintHandling'
import Application from '@ioc:Adonis/Core/Application'

const token = 'AAPKcc5ce8e2db1a4a5095e01202283081afMLj6vXPHKN7kYLr6BywR5rZQesf2QwhH_TMLnGgF--Zh56KmG_0OEMi07i8Ya1yF'

export default class ComplainingSubmissionsController {

    public async index({ response }: HttpContextContract)
    {
        const complaintIssue = await ComplaintIssue.query().where('is_active', '=', true).orderBy('id', 'desc').preload('user').preload('category').preload('images').preload('meteran')

        return response.status(200).json(complaintIssue)
    }

    public async show()
    {
        
    }

    public async store({ auth, request, response }: HttpContextContract)
    {
        try {
            const user = await auth.use('jwt').authenticate()

            const imageSchema = schema.create({
                upload_image: schema.file({
                    size: '2mb',
                    extnames: ['jpg', 'jpeg'],
                }),
            })

            const payload = await request.validate({ schema: imageSchema })

            await payload.upload_image.move(Application.tmpPath('uploads'))
            const fileName = payload.upload_image.fileName;

            const validationIssueSchema = schema.create({
                complaint_name: schema.string({ trim: true }, [
                    rules.maxLength(50)
                ]),
                short_description: schema.string({ trim: true }, [
                    rules.maxLength(100)
                ]),
                priority_level: schema.number([
                    rules.range(1, 5),
                ]),
                category_id: schema.number([
                    rules.range(1, 10)
                ])
            })

            const validationImageSchema = schema.create({
                is_primary: schema.boolean()
            })

            const validationMeteranSchema = schema.create({
                meteran_code: schema.string({ trim: true }, [
                    rules.maxLength(50)
                ]),
                address: schema.string({ trim: true }, [
                    rules.maxLength(100)
                ])
            })
            
            const validatedIssue = await request.validate({
                schema: validationIssueSchema,
                messages: {
                    'complaint_name.required': 'Complaint Name is Required',
                    'complaint_name.maxLength': 'Complaint Name length cannot exceed 50 character',
                    'short_description.required': 'Short Description is Required',
                    'short_description.maxLength': 'Short Description length cannot exceed 100 character',
                    'priority_level.required': 'Priority Level is Required',
                    'priority_level.range': 'Priority Level must between 1 and 5',
                }
            })

            const validatedImage = await request.validate({
                schema: validationImageSchema,
                messages: {
                    'is_primary.required': 'Status Images is Required',
                }
            })
            
            const validatedMeteran = await request.validate({
                schema: validationMeteranSchema,
                messages: {
                    'meteran_code.required': 'File Name is Required',
                    'meteran_code.maxLength': 'File Name length cannot exceed 50 character',
                    'address.required': 'Address is Required',
                    'address.maxLength': 'Address length cannot exceed 100 character',
                }
            })

            const esriApi = await axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address=${validatedMeteran.address}&outFields=*&f=json&token=${token}`)

            const result = esriApi.data.candidates[0]

            const addressEsriApi = result.address
            const latitude = result.location.x
            const longitude = result.location.y

            const transactionProcess = await Database.transaction(async (trx) => {
                /** Insert Image */
                const newImage = new ComplaintImage()
                newImage.$attributes = validatedImage
                newImage.filename = fileName ? fileName : '-'
                newImage.createdBy = user.id
                
                newImage.useTransaction(trx)
                await newImage.save()

                /** Insert Meteran */
                const newMeteran = new Meteran()
                newMeteran.$attributes = validatedMeteran
                newMeteran.address = addressEsriApi
                newMeteran.lat = latitude
                newMeteran.long = longitude
                newMeteran.createdBy = user.id
                
                newMeteran.useTransaction(trx)
                await newMeteran.save()

                /** Insert Complaint Issue */
                const newIssue = new ComplaintIssue()
                newIssue.$attributes = validatedIssue
                newIssue.user_id = user.id
                newIssue.images_id = newImage.id
                newIssue.meteran_id = newMeteran.id
                newIssue.createdBy = user.id
                
                newIssue.useTransaction(trx)
                await newIssue.save()

                /** Insert Complaint Handling */
                const complaintHandling = new ComplaintHandling()
                complaintHandling.complaintIssueId = newIssue.id
                complaintHandling.complaintStatusId = 1
                complaintHandling.createdBy = user.id

                complaintHandling.useTransaction(trx)
                await complaintHandling.save()

                await trx.commit()
                return {
                    issue: newIssue,
                    meteran: newMeteran,
                    image: newImage,
                    complaint: complaintHandling
                }
            })

            return response.status(200).json({
                result: transactionProcess
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
