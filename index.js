const { VM } = require('vm2');
const fs = require('fs');
const ctx = fs.readFileSync('./factory.js').toString();

class Bot {
    constructor(name, greeting, training_set) {
        this.name = name;
        this.greeting = greeting;
        this.factory = new VM();
        this.factory.run(ctx);
        this.factory.run(`training_set=${training_set}`)
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
