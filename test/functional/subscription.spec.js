const { test, trait } = use('Test/Suite')('Subscripton');

/** @typedef {import('@adonisjs/lucid/src/Factory')} Factory */
const Factory = use('Factory');

const Hash = use('Hash');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('user should be able to subscribe to workshops', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  const response = await client
    .post(`/workshops/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(201);

  const subscriptionWorkshop = await user.subscriptions().first();

  assert.equal(subscriptionWorkshop.id, workshop.id);
});

test('user should not be able to subscribe to two workshops in the same section', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const workshop1 = await Factory.model('App/Models/Workshop').create({
    section: 2,
  });
  const workshop2 = await Factory.model('App/Models/Workshop').create({
    section: 2,
  });

  const response1 = await client
    .post(`/workshops/${workshop1.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response1.assertStatus(201);

  const response2 = await client
    .post(`/workshops/${workshop2.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response2.assertStatus(400);

  const subscriptions = await user.subscriptions().count();

  assert.equal(subscriptions[0]['count(*)'], 1);
});

test('workshop can only receive 48 subscriptions', async ({
  assert,
  client,
}) => {
  // ----

  const originalHashMake = Hash.make;
  Hash.make = () => 'fake make';
  const users = await Factory.model('App/Models/User').createMany(48);
  Hash.make = originalHashMake;

  // ----

  const workshop = await Factory.model('App/Models/Workshop').create();

  const userIds = users.map(user => user.id);

  await workshop.subscriptions().attach(userIds);

  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post(`/workshops/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(400);

  const workshopSubscriptions = await workshop.subscriptions().count();

  assert.equal(workshopSubscriptions[0]['count(*)'], 48);
});

test('user should unsubscribe from a workshop', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  await user.subscriptions().attach(workshop.id);

  const response = await client
    .delete(`/workshops/${workshop.id}/subscriptions`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);

  const subscriptionWorkshop = await user.subscriptions().first();

  assert.isNull(subscriptionWorkshop);
});
