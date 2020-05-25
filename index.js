const { VM } = require('vm2')
const fs = require('fs')
const ctx = fs.readFileSync('./factory.js').toString()

class Bot {
  constructor (name, greeting, trainingSet) {
    this.name = name
    this.greeting = greeting
    this.factory = new VM()
    this.factory.run(ctx)
    this.factory.run(`trainingSet=${trainingSet}`)
    this.responses = null;
  }

  greet () {
    return this.render(this.greeting)
  }

  render (statement) {
    return statement.replace(/<bot-name>/g, this.name)
  }

  respond (query) {
    return this.render(this.factory.run(`process("${query}")`))
  }

  train () {
    this.factory.run('train()')
  }
}

exports.Bot = Bot
