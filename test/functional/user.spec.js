const { test, trait } = use('Test/Suite')('User');

/** @typedef {import('@adonisjs/lucid/src/Factory')} Factory */
const Factory = use('Factory');

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to update avatar', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .attach('avatar', Helpers.tmpPath('test/avatar.jpg'))
    .end();

  response.assertStatus(200);
  assert.equal(response.body.attributes, user.attributes);
  assert.exists(response.body.avatar);
});
