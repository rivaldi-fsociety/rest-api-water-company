/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  /** CRUD Account */
  Route.get('/account','AccountsController.index')
  Route.get('/account/:id','AccountsController.show')
  Route.patch('/account/:id','AccountsController.update')
  Route.patch('/account/delete/:id','AccountsController.delete')
  Route.patch('/account/activate/:id','AccountsController.activate')

  /** CRUD User */
  Route.get('/user','UsersController.index')
  Route.get('/user/:id','UsersController.show')
  Route.patch('/user/:id','UsersController.update')
  Route.patch('/user/delete/:id','UsersController.delete')
  Route.patch('/user/activate/:id','UsersController.activate')

  /** CRUD Office */
  Route.get('/officer','OfficersController.index')
  Route.post('/officer','OfficersController.store')
  Route.get('/officer/:id','OfficersController.show')
  Route.patch('/officer/:id','OfficersController.update')
  Route.patch('/officer/delete/:id','OfficersController.delete')
  Route.patch('/officer/activate/:id','OfficersController.activate')

  /** CRUD Complaint Categories */
  Route.get('/categories','CategoriesController.index')
  Route.get('/categories/:id','CategoriesController.show')
  Route.post('/categories','CategoriesController.store')
  Route.patch('/categories/:id','CategoriesController.update')
  Route.patch('/categories/delete/:id','CategoriesController.delete')

  /** CRUD Complaint Statuses */
  Route.get('/complaint-status','ComplaintStatusesController.index')
  Route.get('/complaint-status/:id','ComplaintStatusesController.show')
  Route.post('/complaint-status','ComplaintStatusesController.store')
  Route.patch('/complaint-status/:id','ComplaintStatusesController.update')
  Route.patch('/complaint-status/delete/:id','ComplaintStatusesController.delete')

  /** CRUD Roles */
  Route.get('/role','RolesController.index')
  Route.get('/role/:id','RolesController.show')
  Route.post('/role','RolesController.store')
  Route.patch('/role/:id','RolesController.update')
  Route.patch('/role/delete/:id','RolesController.delete')

  /** CRUD Complaining Submissions */
  Route.get('/complaining-submission','ComplainingSubmissionsController.index')
  Route.get('/complaining-submission/:id','ComplainingSubmissionsController.show')
  Route.post('/complaining-submission','ComplainingSubmissionsController.store')
  Route.patch('/complaining-submission/:id','ComplainingSubmissionsController.update')
  Route.patch('/complaining-submission/delete/:id','ComplainingSubmissionsController.delete')

  /** CRUD Complaining Handlings */
  Route.get('/complaint-handling','ComplaintHandlingsController.index')
  Route.get('/complaint-handling/:id','ComplaintHandlingsController.show')
  Route.post('/complaint-handling','ComplaintHandlingsController.store')
  Route.patch('/complaint-handling/:id','ComplaintHandlingsController.update')
  Route.patch('/complaint-handling/delete/:id','ComplaintHandlingsController.delete')
}).middleware('auth:jwt')

/** Login and Register Page */
Route.get('/login','LoginController.index').middleware('guest')
Route.get('/register','RegistersController.index').middleware('guest')

/** Authentication */
Route.post('/login','AuthController.login').middleware('guest')
Route.post('/register','AuthController.register').middleware('guest')