'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

class WorkshopController {
  async index() {
    const workshops = await Workshop.query()
      .with('user', builder => {
        builder.select(['id', 'name', 'avatar']);
      })
      .fetch();

    return workshops;
  }

  async show({ params }) {
    const workshop = await Workshop.find(params.id);

    await workshop.load('user', builder => {
      builder.select(['id', 'name', 'github', 'linkedin', 'avatar']);
    });

    return workshop;
  }

  async store({ request, response }) {
    const data = request.only(['title', 'description', 'user_id', 'section']);

    const workshop = await Workshop.create(data);

    return response.status(201).json(workshop);
  }

  async update({ request, params }) {
    const data = request.only(['title', 'description', 'user_id', 'section']);

    const workshop = await Workshop.find(params.id);

    workshop.merge(data);

    await workshop.save();

    return workshop;
  }

  async destroy({ params }) {
    const workshop = await Workshop.find(params.id);

    await workshop.delete();
  }
}

module.exports = WorkshopController;
