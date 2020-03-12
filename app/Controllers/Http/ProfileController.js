'use strict';

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers');

class ProfileController {
  async update({ request, auth }) {
    const data = request.only(['name', 'title', 'bio', 'github', 'linkedin']);

    const user = await auth.getUser();

    const validationOptions = {
      types: ['image'],
      size: '2mb',
    };

    const avatar = request.file('avatar', validationOptions);

    if (avatar) {
      await avatar.move(Helpers.tmpPath('uploads'), {
        name: `${new Date().getTime()}.${avatar.subtype}`,
      });

      if (!avatar.moved()) {
        return avatar.error();
      }

      user.avatar = avatar.fileName;
    }

    user.merge(data);

    const password = request.input('password');

    if (password) {
      user.password = password;
    }

    await user.save();

    return user;
  }
}

module.exports = ProfileController;
