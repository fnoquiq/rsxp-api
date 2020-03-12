const { test, trait } = use('Test/Suite')('Workshop');

/** @typedef {import('@adonisjs/lucid/src/Factory')} Factory */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/workshops')
    .loginVia(user, 'jwt')
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

test('it should be able to list workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').make();
  await user.workshops().save(workshop);

  const response = await client
    .get('/workshops')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].title, workshop.title);
  assert.equal(response.body[0].user.id, user.id);
});

test('it should be able to show single workshops', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();
  await user.workshops().save(workshop);

  const response = await client
    .get(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.title, workshop.title);
  assert.equal(response.body.user.id, user.id);
});

test('it should be able to update workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    title: 'Old title',
  });

  const response = await client
    .put(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .send({
      ...workshop.toJSON(),
      title: 'New title',
    })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.title, 'New title');
});
