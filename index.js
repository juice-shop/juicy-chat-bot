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

    addUser() {
        //TODO
        return true;
    }

    render(statement, token) {
        return statement.replace(/<bot-name>/g, this.name).replace(/<customer-name>/g, this.factory.run(`currentUser(${token})`));
    }

    respond(query, token) {
        response = this.factory.run(`process("${query}", "${token}")`);
        if (response.action == "response") {
            return this.render(response.message, token);
        }
        else {
            this.addUser();
        }
    }

  train () {
    this.factory.run('train()')
  }
}

exports.Bot = Bot
