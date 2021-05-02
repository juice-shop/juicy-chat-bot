/*
 * Copyright (c) 2020-2021 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

const chai = require('chai')
const expect = chai.expect
const juice = require('../index')

const trainingSet = {
  lang: 'en',
  data: [
    {
      intent: 'greetings.bye',
      utterances: [
        'goodbye for now',
        'bye bye take care'
      ],
      answers: [
        {
          action: 'response',
          body: 'Ok Cya'
        }
      ]
    },
    {
      intent: 'greetings.hello',
      utterances: [
        'hello',
        'hi',
        'howdy'
      ],
      answers: [
        {
          action: 'response',
          body: 'Hello <customer-name>'
        }
      ]
    },
    {
      intent: 'jokes.chucknorris',
      utterances: [
        'tell me a chuck norris joke'
      ],
      answers: [
        {
          action: 'response',
          body: 'Chuck Norris has two speeds: Walk and Kill.'
        },
        {
          action: 'response',
          body: 'Time waits for no man. Unless that man is Chuck Norris.'
        }
      ]
    }
  ]
}

describe('Initialize', () => {
  let bot

  beforeEach(() => {
    bot = new juice.Bot('Jeff', 'Ma Nemma <bot-name>', JSON.stringify(trainingSet), 'lalala')
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
    expect(await bot.getUser('1234')).to.equal('user2')
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

  it('should respond randomly from multiple available answers', async () => {
    const responseCounter = { 'Chuck Norris has two speeds: Walk and Kill.': 0, 'Time waits for no man. Unless that man is Chuck Norris.': 0 }
    await bot.train()
    for (let i = 0; i < 100; i++) {
      const response = await bot.respond('tell me a chuck norris joke', '123')
      expect([
        {
          action: 'response',
          body: 'Chuck Norris has two speeds: Walk and Kill.'
        },
        {
          action: 'response',
          body: 'Time waits for no man. Unless that man is Chuck Norris.'
        }
      ]).to.deep.include(response)
      responseCounter[response.body]++
    }
    expect(responseCounter['Chuck Norris has two speeds: Walk and Kill.']).to.be.greaterThan(20)
    expect(responseCounter['Time waits for no man. Unless that man is Chuck Norris.']).to.be.greaterThan(20)
  })

  it('should respond with default response to unrecognized query', async () => {
    await bot.train()
    expect(await bot.respond('blabla blubb blubb', '123')).to.deep.equal({
      action: 'response',
      body: 'lalala'
    })
  })
})
