/*
 * Copyright (c) 2020-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { VM } from 'vm2'
import fs from 'fs'
import path from 'path'
import NlpManager from './nlp'

const ctx = fs.readFileSync(path.join(__dirname, 'factory.js')).toString()

interface Training {
  state: boolean
  data: string
}

interface BotResponse {
  action: string
  body: string
}

interface BotQueryResponse {
  action: string
  body?: string
  [key: string]: any
}

class Bot {
  name: string
  greeting: string
  defaultResponse!: BotResponse
  training!: Training
  factory: VM

  constructor (
    name: string,
    greeting: string,
    trainingSet: string,
    defaultResponse: string
  ) {
    this.name = name
    this.greeting = greeting
    this.defaultResponse = { action: 'response', body: defaultResponse }
    this.training = {
      state: false,
      data: trainingSet
    }
    this.factory = new VM({
      sandbox: {
        Nlp: NlpManager,
        training: this.training
      }
    })
    this.factory.run(ctx)
    this.factory.run(`trainingSet=${trainingSet}`)
  }

  greet (token: string): string {
    return this.render(this.greeting, token)
  }

  render (statement: string, token: string): string {
    const currentUser = String(this.factory.run(`currentUser("${token}")`))
    return statement.replace(/<bot-name>/g, this.name).replace(/<customer-name>/g, currentUser)
  }

  addUser (token: string, name: string): void {
    this.factory.run(`users.addUser("${token}", "${name}")`)
  }

  getUser (token: string): string {
    return this.factory.run(`users.get("${token}")`)
  }

  async respond (query: string, token: string): Promise<BotResponse> {
    const response: BotQueryResponse = (await this.factory.run(`process("${query}", "${token}")`)).answer
    if (response == null) {
      return this.defaultResponse
    } else {
      if (response.body != null) {
        response.body = this.render(response.body, token)
      }
      return response as BotResponse
    }
  }

  train (): any {
    return this.factory.run('train()')
  }
}

export default Bot
