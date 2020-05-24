const juice = require('../index') // import the package
const assert = require('assert')
const trainingSet = { 'hi bot': 'hello', "what's your name?": '<bot-name>' }

// initiaize and instance of the Bot class
// args: name, greeting statement, training data in JSON format
// <bot-name> will be replaced by the name of the bot
const bot = new juice.Bot('Jeff', 'Ma Nemma <bot-name>', JSON.stringify(trainingSet))

// Check: greeting works properly
assert.strictEqual(bot.greet(), 'Ma Nemma Jeff')

// Check: training data has been registered properly
assert.deepStrictEqual(bot.factory.run('trainingSet'), trainingSet)

// Check: Bot is trained without any errors
bot.train()

// Check: Response data has been updated after training
assert.deepStrictEqual(bot.factory.run('responseSet'), trainingSet)

// Check: Bot responses appropriately for registered queries
assert.strictEqual(bot.respond("what's your name?"), 'Jeff')

console.log('Tests finished with no errors')
