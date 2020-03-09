const { test, trait } = use('Test/Suite')('Forgot Password')

const Mail = use('Mail')
const Hash = use('Hash')
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('it should send an email with reset password instructions', async ({
  assert,
  client
}) => {
  Mail.fake()

  const email = 'gabrielteixeiramesquita@gmail.com'

  const user = await Factory.model('App/Models/User').create({ email })

  await client
    .post('/forgot')
    .send({ email })
    .end()

  const token = await user.tokens().first()

  const recentEmail = Mail.pullRecent()

  assert.equal(recentEmail.message.to[0].address, email)

  assert.include(token.toJSON(), {
    type: 'forgotPassword'
  })

  Mail.restore()
})

test('it should be able to reset password', async ({ assert, client }) => {
  Mail.fake()

  const email = 'gabrielteixeiramesquita@gmail.com'
  const password = '123456'

  const user = await Factory.model('App/Models/User').create({ email })
  const userToken = await Factory.model('App/Models/Token').make()

  await user.tokens().save(userToken)

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password,
      password_confirmation: password
    })
    .end()

  response.assertStatus(204)

  await user.reload()
  const checkPassword = await Hash.verify(password, user.password)

  assert.isTrue(checkPassword)

  Mail.restore()
})
