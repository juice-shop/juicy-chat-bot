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
      answer: 'Hello there!'
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

  it('should update response data after training', () => {
    expect(() => bot.train()).to.not.throw()
    expect(bot.factory.run('responseSet')).to.deep.equal(trainingSet)
  })

  it('should recognize registered user from token', () => {
    expect(() => bot.train()).to.not.throw()
    expect(bot.respond('hi bot', '123').action).to.equal('response')
    expect(bot.respond('hi bot', '123').message).to.equal('hello test-user')
  })

  it('should register new user with corresponsing token', () => {
    expect(() => bot.train()).to.not.throw()
    expect(() => bot.addUser('1234', 'user2')).to.not.throw()
    expect(bot.respond('hi bot', '1234').action).to.equal('response')
    expect(bot.respond('hi bot', '1234').message).to.equal('hello user2')
  })

  it('should respond to registered query after training', () => {
    expect(() => bot.train()).to.not.throw()
    expect(bot.respond("what's your name?", '123').action).to.equal('response')
    expect(bot.respond("what's your name?", '123').message).to.equal('Jeff')
  })
})
