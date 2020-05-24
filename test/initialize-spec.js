const chai = require('chai')
const expect = chai.expect
const juice = require('../index')
const trainingSet = { 'hi bot': 'hello', "what's your name?": '<bot-name>' }

describe('Initialize', () => {
  let bot

  beforeEach(() => {
    bot = new juice.Bot('Jeff', 'Ma Nemma <bot-name>', JSON.stringify(trainingSet))
  })

  it('should set up greeting for bot', () => {
    expect(bot.greet()).to.equal('Ma Nemma Jeff')
  })

  it('should register training set in bot', () => {
    expect(bot.factory.run('trainingSet')).to.deep.equal(trainingSet)
  })

  it('should update response data after training', () => {
    expect(() => bot.train()).to.not.throw()
    expect(bot.factory.run('responseSet')).to.deep.equal(trainingSet)
  })

  it('should respond to registered query after training', () => {
    expect(() => bot.train()).to.not.throw()
    expect(bot.respond("what's your name?")).to.equal('Jeff')
  })
})
