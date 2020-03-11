'use strict';

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers');

class ProfileController {
  async update({ request, auth }) {
    const user = await auth.getUser();

    const validationOptions = {
      types: ['image'],
      size: '2mb',
    };

    const avatar = request.file('avatar', validationOptions);

    await avatar.move(Helpers.tmpPath('uploads'), {
      name: `${new Date().getTime()}.${avatar.subtype}`,
    });

    if (!avatar.moved()) {
      return avatar.error();
    }

    user.avatar = avatar.fileName;

    await user.save();

    return user;
  }
}

module.exports = ProfileController;
