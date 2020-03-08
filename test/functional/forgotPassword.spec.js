const { test, trait } = use('Test/Suite')('Forgot Password')

const Mail = use('Mail')
const Factory = use('Factory')

const User = use('App/Models/User')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('it should send an email with reset password instructions', async ({
  assert,
  client
}) => {
  Mail.fake()

  const forgotPayload = {
    email: 'gabrielteixeiramesquita@gmail.com'
  }

  await Factory.model('App/Models/User').create(forgotPayload)

  const response = await client
    .post('/forgot')
    .send(forgotPayload)
    .end()

  response.assertStatus(204)

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, forgotPayload.email)

  Mail.restore()
})
