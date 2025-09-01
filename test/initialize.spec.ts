/*
 * Copyright (c) 2020-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import Bot from '../index'; 

interface BotResponse {
  action: string;
  body: string;
}

interface Answer {
  action: string;
  body: string;
}

interface TrainingData {
  intent: string;
  utterances: string[];
  answers: Answer[];
}

interface TrainingSet {
  lang: string;
  data: TrainingData[];
}

const trainingSet: TrainingSet = {
  lang: 'en',
  data: [
    {
      intent: 'greetings.bye',
      utterances: ['goodbye for now', 'bye bye take care'],
      answers: [{ action: 'response', body: 'Ok Cya' }]
    },
    {
      intent: 'greetings.hello',
      utterances: ['hello', 'hi', 'howdy'],
      answers: [{ action: 'response', body: 'Hello <customer-name>' }]
    },
    {
      intent: 'jokes.chucknorris',
      utterances: ['tell me a chuck norris joke'],
      answers: [
        { action: 'response', body: 'Chuck Norris has two speeds: Walk and Kill.' },
        { action: 'response', body: 'Time waits for no man. Unless that man is Chuck Norris.' }
      ]
    }
  ]
};

describe('Initialize', () => {
  let bot: Bot;

  beforeEach(() => {
    bot = new Bot('Jeff', 'Ma Nemma <bot-name>', JSON.stringify(trainingSet), 'lalala');
    assert.doesNotThrow(() => bot.addUser('123', 'test-user'));
  });

  it('should set up greeting for bot', () => {
    assert.strictEqual(bot.greet('123'), 'Ma Nemma Jeff');
  });

  it('should register training set in bot', () => {
    assert.deepStrictEqual(bot.factory.run('trainingSet'), trainingSet);
  });

  it('should recognize registered user from token', async () => {
    await bot.train();
    assert.strictEqual(bot.training.state, true);
    assert.deepStrictEqual(await bot.respond('hi bot', '123'), {
      action: 'response',
      body: 'Hello test-user'
    });
  });

  it('should register new user with corresponding token', async () => {
    await bot.train();
    assert.doesNotThrow(() => bot.addUser('1234', 'user2'));
    assert.strictEqual(await bot.getUser('1234'), 'user2');
    assert.deepStrictEqual(await bot.respond('hi bot', '1234'), {
      action: 'response',
      body: 'Hello user2'
    });
  });

  it('should respond to queries after training', async () => {
    await bot.train();
    assert.deepStrictEqual(await bot.respond('bye', '123'), {
      action: 'response',
      body: 'Ok Cya'
    });
  });

  it('should respond randomly from multiple available answers', async () => {
    const responseCounter: Record<string, number> = { 
      'Chuck Norris has two speeds: Walk and Kill.': 0, 
      'Time waits for no man. Unless that man is Chuck Norris.': 0 
    };
    const possibleAnswers: string[] = Object.keys(responseCounter);
    
    await bot.train();
    for (let i = 0; i < 100; i++) {
      const response: BotResponse = await bot.respond('tell me a chuck norris joke', '123');
      assert.strictEqual(response.action, 'response');
      assert.ok(possibleAnswers.includes(response.body));
      responseCounter[response.body]++;
    }
    assert.ok(responseCounter['Chuck Norris has two speeds: Walk and Kill.'] > 20);
    assert.ok(responseCounter['Time waits for no man. Unless that man is Chuck Norris.'] > 20);
  });

  it('should respond with default response to unrecognized query', async () => {
    await bot.train();
    assert.deepStrictEqual(await bot.respond('blabla blubb blubb', '123'), {
      action: 'response',
      body: 'lalala'
    });
  });
});