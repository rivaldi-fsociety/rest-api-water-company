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
  Route.get('/user','UsersController.index') /** Read Users */
  Route.get('/user/:id','UsersController.show') /** Read Users by ID*/
  Route.patch('/user/:id','UsersController.update') /** Update User */
  Route.patch('/user/delete/:id','UsersController.delete') /** Delete User */
  Route.patch('/user/activate/:id','UsersController.activate') 

  /** CRUD Office */
  Route.get('/officer','OfficersController.index') /** Read Users Officer */
  Route.post('/officer','OfficersController.store') /** Create Users Officer */
  Route.get('/officer/:id','OfficersController.show') /** Read Users Officer by ID */
  Route.patch('/officer/:id','OfficersController.update') /** Update Officer */
  Route.patch('/officer/delete/:id','OfficersController.delete') /** Delete Officer */
  Route.patch('/officer/activate/:id','OfficersController.activate') /** Activate Officer */

  /** CRUD Complaint Categories */
  Route.get('/categories','CategoriesController.index') /** Read Categories */
  Route.post('/categories','CategoriesController.store') /** Create Categories */
  // Route.get('/categories/:id','CategoriesController.show')
  // Route.patch('/categories/:id','CategoriesController.update')
  // Route.patch('/categories/delete/:id','CategoriesController.delete')

  /** CRUD Complaint Statuses */
  Route.get('/complaint-status','ComplaintStatusesController.index') /** Read Complaint Status */
  Route.post('/complaint-status','ComplaintStatusesController.store') /** Create Complaint Status */
  // Route.get('/complaint-status/:id','ComplaintStatusesController.show')
  // Route.patch('/complaint-status/:id','ComplaintStatusesController.update')
  // Route.patch('/complaint-status/delete/:id','ComplaintStatusesController.delete')

  /** CRUD Roles */
  Route.get('/role','RolesController.index') /** Read Roles */
  Route.post('/role','RolesController.store') /** Create Roles */
  // Route.get('/role/:id','RolesController.show')
  // Route.patch('/role/:id','RolesController.update')
  // Route.patch('/role/delete/:id','RolesController.delete')

  /** CRUD Complaining Submissions */
  Route.get('/complaining-submission','ComplainingSubmissionsController.index') /** Read Complaint Issue */
  Route.post('/complaining-submission','ComplainingSubmissionsController.store') /** Create Complaint Issue */
  Route.get('/complaining-submission/:id','ComplainingSubmissionsController.show') /** Read Complaint Issue by ID */
  Route.patch('/complaining-submission/:id','ComplainingSubmissionsController.update') /** Update Complaint Issue */
  Route.patch('/complaining-submission/delete/:id','ComplainingSubmissionsController.delete') /** Delete Complaint Issue */
  Route.patch('/complaining-submission/activate/:id','ComplainingSubmissionsController.activate') /** Activate Complaint Issue */

  /** CRUD Complaining Handlings */
  Route.get('/complaint-handling','ComplaintHandlingsController.index') /** Read Complaint Handlings */
  // Route.post('/complaint-handling','ComplaintHandlingsController.store')
  Route.get('/complaint-handling/:id','ComplaintHandlingsController.show') /** Read Complaint Handlings by ID */
  Route.patch('/complaint-handling/:id','ComplaintHandlingsController.update') /** Update Complaint Handlings */
  // Route.patch('/complaint-handling/delete/:id','ComplaintHandlingsController.delete')
}).middleware('auth:jwt')

/** Login and Register Page */
Route.get('/login','LoginController.index').middleware('guest')
Route.get('/register','RegistersController.index').middleware('guest')

/** Authentication */
Route.post('/login','AuthController.login').middleware('guest')
Route.post('/register','AuthController.register').middleware('guest') /** Create User */