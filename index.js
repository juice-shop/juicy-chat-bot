const { VM } = require('vm2')
const fs = require('fs')
const path = require('path') // eslint-disable-line no-unused-vars
const ctx = fs.readFileSync(`${__dirname}/factory.js`).toString()
const { NlpManager } = require('node-nlp')

class Bot {
  constructor (name, greeting, trainingSet, responseCallback) {
    this.name = name
    this.greeting = greeting
    this.training = {
      state: false,
      data: trainingSet
    }
    this.factory = new VM({
      sandbox: {
        Nlp: NlpManager,
        callback: responseCallback,
        training: this.training
      }
    })
    this.factory.run(ctx)
    this.factory.run(`trainingSet=${trainingSet}`)
  }

  greet () {
    return this.render(this.greeting)
  }

  addUser (token, name) {
    this.factory.run(`users.addUser("${token}", "${name}")`)
  }

  render (statement, token) {
    return statement.replace(/<bot-name>/g, this.name).replace(/<customer-name>/g, this.factory.run(`currentUser(${token})`))
  }

  async respond (query, token) {
    const response = this.factory.run(`process("${query}", "${token}")`)
    let message
    if (response.action == 'response') {
      message = await response.body
      message = message.answer
    } else {
      message = response.body
    }
    message = this.render(message, token)
    return { action: response.action, body: message}
  }

  train () {
    this.factory.run('train()')
  }
}

exports.Bot = Bot
