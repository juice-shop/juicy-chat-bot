const chai = require('chai')
const expect = chai.expect
const juice = require('../index')
const trainingSet = {
  lang: 'en',
  intents: [
    {
      question: 'goodbye for now',
      intent: 'greetings.bye'
    },
    {
      question: 'bye bye take care',
      intent: 'greetings.bye'
    },
    {
      question: 'hello',
      intent: 'greetings.hello'
    },
    {
      question: 'hi',
      intent: 'greetings.hello'
    },
    {
      question: 'howdy',
      intent: 'greetings.hello'
    }
  ],
  answers: [
    {
      intent: 'greetings.bye',
      answer: 'Ok Cya'
    },
    {
      intent: 'greetings.hello',
      answer: 'Hello <customer-name>'
    }
  ]
}

describe('Initialize', () => {
  let bot

  beforeEach(() => {
    bot = new juice.Bot('Jeff', 'Ma Nemma <bot-name>', JSON.stringify(trainingSet))
    expect(() => bot.addUser('123', 'test-user')).to.not.throw()
  })

  it('should set up greeting for bot', () => {
    expect(bot.greet()).to.equal('Ma Nemma Jeff')
  })

  it('should register training set in bot', () => {
    expect(bot.factory.run('trainingSet')).to.deep.equal(trainingSet)
  })

  it('should recognize registered user from token', async () => {
    await bot.train()
    expect(bot.training.state).to.equal(true)
    expect(await bot.respond('hi bot', '123')).to.deep.equal({
      action: 'response',
      body: 'Hello test-user'
    })
  })

  it('should register new user with corresponsing token', async () => {
    await bot.train()
    expect(() => bot.addUser('1234', 'user2')).to.not.throw()
    expect(await bot.respond('hi bot', '1234')).to.deep.equal({
      action: 'response',
      body: 'Hello user2'
    })
  })

  it('should respond to queries after training', async () => {
    await bot.train()
    expect(await bot.respond('bye', '123')).to.deep.equal({
      action: 'response',
      body: 'Ok Cya'
    })
  })
})
