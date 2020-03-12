const { test, trait } = use('Test/Suite')('User');

/** @typedef {import('@adonisjs/lucid/src/Factory')} Factory */
const Factory = use('Factory');

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers');

const Hash = use('Hash');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to update avatar', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Gabriel',
    password: '123456',
  });

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .field('name', 'Jorge')
    .field('password', '1234567')
    .field('password_confirmation', '1234567')
    .attach('avatar', Helpers.tmpPath('test/avatar.jpg'))
    .end();

  response.assertStatus(200);
  assert.equal(response.body.name, 'Jorge');
  assert.equal(response.body.atrributes, user.atrributes);
  assert.exists(response.body.avatar);

  await user.reload();

  assert.isTrue(await Hash.verify('1234567', user.password));
});
