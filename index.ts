/*
 * Copyright (c) 2020-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

const { VM } = require("vm2");
const fs = require("fs");

// Type definitions
interface TrainingData {
  lang: string;
  data: QueryData[];
}

interface QueryData {
  intent: string;
  utterances: string[];
  answers: string[];
}

interface Training {
  state: boolean;
  data: TrainingData;
}

interface BotResponse {
  action: string;
  body: string;
  intent?: string;
  answer?: string;
  score?: number;
}

interface NlpManager {
  new (config: any): any;
}

class Bot {
  private name: string;
  private greeting: string;
  private defaultResponse: BotResponse;
  public training: Training;
  public factory: any;

  constructor(
    name: string,
    greeting: string,
    trainingSet: TrainingData | string,
    defaultResponse: string
  ) {
    this.name = name;
    this.greeting = greeting;
    this.defaultResponse = { action: "response", body: defaultResponse };

    // Accept both string and object for trainingSet
    let parsedTrainingSet: TrainingData;
    if (typeof trainingSet === "string") {
      parsedTrainingSet = JSON.parse(trainingSet);
    } else {
      parsedTrainingSet = trainingSet;
    }

    this.training = {
      state: false,
      data: parsedTrainingSet,
    };

    const NlpManager: NlpManager = require("./nlp");
    const ctx: string = fs.readFileSync(`${__dirname}/factory.js`).toString();

    this.factory = new VM({
      sandbox: {
        Nlp: NlpManager,
        training: this.training,
      },
    });

    this.factory.run(ctx);
    // Always assign the object, not a string
    this.factory.run(`trainingSet = ${JSON.stringify(parsedTrainingSet)}`);
    // Debug: Log the training data structure
    console.log(
      "Training data structure:",
      JSON.stringify(this.training, null, 2)
    );
  }

  greet(token: string): string {
    return this.render(this.greeting, token);
  }

  addUser(token: string, name: string): void {
    this.factory.run(`users.addUser("${token}", "${name}")`);
  }

  getUser(token: string): string | undefined {
    return this.factory.run(`users.get("${token}")`) as string | undefined;
  }

  private render(statement: string, token: string): string {
    const currentUser = this.factory.run(`currentUser("${token}")`);
    return statement
      .replace(/<bot-name>/g, this.name)
      .replace(/<customer-name>/g, currentUser || "Guest");
  }

  async respond(query: string, token: string): Promise<BotResponse> {
    try {
      const result = await this.factory.run(`process("${query}", "${token}")`);
      const response = result?.answer;

      if (!response) {
        return this.defaultResponse;
      } else {
        if (response.body) {
          response.body = this.render(response.body, token);
        }
        return response as BotResponse;
      }
    } catch (error) {
      console.error("Error in bot response:", error);
      return this.defaultResponse;
    }
  }

  train(): Promise<void> {
    return this.factory.run("train()") as Promise<void>;
  }
}

export { Bot };

// For CommonJS compatibility
module.exports = { Bot };
