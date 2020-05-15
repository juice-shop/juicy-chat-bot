const { VM } = require('vm2');

class Bot {
    constructor(name, greeting) {
        this.name = name;
        this.greeting = greeting;
        this.factory = new VM()
        this.training_set = null;
        this.responses = null;
    }

    greet() {
        return this.render(this.greeting);
    }

    render(statement) {
        return statement.replace(/<name>/g, this.name);
    }
    
}

exports.Bot = Bot;