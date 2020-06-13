const { VM } = require('vm2')
const fs = require('fs')
const path = require('path') // eslint-disable-line no-unused-vars
const ctx = fs.readFileSync(`${__dirname}/factory.js`).toString()
const { NlpManager } = require('node-nlp')

class Bot {
  constructor (name, greeting, trainingSet, reponseCallback) {
    this.name = name
    this.greeting = greeting
    this.training = {
      state: false,
      data: trainingSet,
    }
    this.factory = new VM({
      sandbox: {
        nlp: NlpManager,
        callback: callback,
        training: this.training,
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

  respond (query, token) {
    const response = this.factory.run(`process("${query}", "${token}")`)
    response.message = this.render(response.message, token)
    return response
  }

  train () {
    this.factory.run('train()')
  }

  toggleState () {
    console.log(this)
  }

}

exports.Bot = Bot
