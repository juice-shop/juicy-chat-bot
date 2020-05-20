const { VM } = require('vm2');
// const responseModel = require('./responseFactory');

class Bot {
    constructor(name, greeting, training_set) {
        this.name = name;
        this.greeting = greeting;
        this.ctx = responseModel.context;
        this.ctx.training_set = training_set;
        this.factory = new VM({ sandbox: this.ctx });
        this.responses = null;
    }

    greet() {
        return this.render(this.greeting);
    }

    render(statement) {
        return statement.replace(/<name>/g, this.name);
    }
    
    respond(query) {
        return this.render(this.factory.run(`process("${query}")`))
    }

    train() {
        this.factory.run(`train()`);
    }
}

exports.Bot = Bot;