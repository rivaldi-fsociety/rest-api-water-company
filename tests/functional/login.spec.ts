import { test } from '@japa/runner'

const request = {
  body:{
    email:"superadmin@gmail.com",
    password:"12345"
  }
}

test('login successfull', async ({ client }) => {
  const response = await client.post('/login').json({
    email: request.body.email,
    password: request.body.password,
  })

  response.assertStatus(200)
})

test('login email is not registered', async ({ client }) => {
  const response = await client.post('/login').json({
    email: "",
    password: "",
  })
  response.assertStatus(400)
  response.assertBodyContains({error:'Email is not registered.'})
})

test('login password not verify', async ({ client }) => {
  const response = await client.post('/login').json({
    email: request.body.email,
    password: "",
  })
  response.assertStatus(400)
  response.assertBodyContains({error:'Invalid Email or Password.'})
})
