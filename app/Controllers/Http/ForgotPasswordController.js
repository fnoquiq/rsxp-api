'use strict'

const Mail = use('Mail')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class ForgotPasswordController {
  async store({ request }) {
    const { email } = request.all(['email'])

    const user = await User.findByOrFail('email', email)

    await Mail.send('emails.forgotPassword', { name: user.name }, message => {
      message
        .to(user.email)
        .from('oi@rocketseat.com.br')
        .subject('RS/XP Recuperação de senha')
    })
  }
}

module.exports = ForgotPasswordController
