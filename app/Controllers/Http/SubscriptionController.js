'use strict';

const Workshop = use('App/Models/Workshop');

class SubscriptionController {
  async store({ response, params, auth }) {
    const user = await auth.getUser();
    const { workshop_id } = params;

    const workshop = await Workshop.find(workshop_id);

    const checkSubscriptions = await user
      .subscriptions()
      .where('section', workshop.section)
      .first();

    if (checkSubscriptions) {
      return response.status(400).json({
        error: 'You cannot subscribe to two workshops in the same section.',
      });
    }

    const countSubscriptions = await workshop.subscriptions().count();

    if (countSubscriptions[0]['count(*)'] === 48) {
      return response.status(400).json({
        error: 'The workshop is full.',
      });
    }

    await user.subscriptions().attach(workshop_id);

    return response.status(201).send();
  }

  async destroy({ params, auth }) {
    const user = await auth.getUser();
    const { workshop_id } = params;

    await user.subscriptions().detach(workshop_id);
  }
}

module.exports = SubscriptionController;
