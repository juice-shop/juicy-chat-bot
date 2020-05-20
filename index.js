const { VM } = require('vm2');
const factory = require('./factory')

class Bot {
    constructor(name, greeting, training_set) {
        this.name = name;
        this.greeting = greeting;
        this.ctx = factory.context;
        this.ctx.training_set = training_set;
        this.factory = new VM({ sandbox: ctx });
        this.responses = null;
    }

    greet() {
        return this.render(this.greeting);
    }

    render(statement) {
        return statement.replace(/<name>/g, this.name);
    }
    
    train() {
        this.factory.run(`train();`);
    }
}

exports.Bot = Bot;