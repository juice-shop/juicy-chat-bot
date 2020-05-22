const juice = require('../index'); //import the package
const assert = require('assert')
const training_set = {"hi bot":"hello","what\'s your name?":"<bot-name>"}

//initiaize and instance of the Bot class
//args: name, greeting statement, training data in JSON format
//<bot-name> will be replaced by the name of the bot
bot = new juice.Bot('Jeff','Ma Nemma <bot-name>', JSON.stringify(training_set));

//Check: greeting works properly
assert.equal(bot.greet(), 'Ma Nemma Jeff')

//Check: training data has been registered properly
assert.deepEqual(bot.factory.run('training_set'), training_set)

//Check: Bot is trained without any errors
bot.train();

//Check: Response data has been updated after training
assert.deepEqual(bot.factory.run('response_set'), training_set)

//Check: Bot responses appropriately for registered queries
assert.equal(bot.respond("what\'s your name?"), "Jeff")
