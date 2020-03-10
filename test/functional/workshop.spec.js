const { test, trait } = use('Test/Suite')('Workshop');

/** @typedef {import('@adonisjs/lucid/src/Factory')} Factory */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should be able to create workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/workshops')
    .send({
      title: 'Utilizando NodeJS para construir API`s seguras.',
      description:
        'Se você já buscou sobre as melhores linguagens back-end, este é para voce.',
      user_id: user.id,
      section: 1,
    })
    .end();

  response.assertStatus(201);
  assert.exists(response.body.id);
});
