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
  }

  greet () {
    return this.render(this.greeting)
  }

    addUser(token) {
        this.factory.run(`users.addUser("${token}", "scar")`);
    }

    render(statement, token) {
        return statement.replace(/<bot-name>/g, this.name).replace(/<customer-name>/g, this.factory.run(`currentUser(${token})`));
    }

    respond(query, token) {
        let response = this.factory.run(`process("${query}", "${token}")`);
        if (response.action == "unrecognized") {
            this.addUser(token)
            return
        }
        return this.render(response.message, token);
    }

  train () {
    this.factory.run('train()')
  }
}

exports.Bot = Bot
