/*
 * Copyright (c) 2020-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable no-unused-vars */
declare const Nlp: new (settings?: any) => any;
declare let training: { state: boolean, data: any };

var trainingSet = training.data;
const model = new Nlp({ languages: ['en'], nlu: { log: false }, autoSave: false, autoLoad: false, modelFileName: '' });

var users = {
  idmap: {} as Record<string, string>,

  addUser: function (token: string, name: string): void {
    this.idmap[token] = name;
  },

  get: function (token: string): string | undefined {
    return this.idmap[token];
  }
};

function train(): Promise<void> {
  trainingSet.data.forEach((query: any) => {
    query.utterances.forEach((utterance: string) => {
      model.addDocument(trainingSet.lang, utterance, query.intent);
    });
    query.answers.forEach((answer: any) => {
      model.addAnswer(trainingSet.lang, query.intent, answer);
    });
  });
  return model.train().then(() => { training.state = true; });
}

function processQuery(query: string, token: string): Promise<any> | { action: string, body: string } {  if (users.get(token)) {
    return model.process(trainingSet.lang, query);
  } else {
    return { action: 'unrecognized', body: 'user does not exist' };
  }
}

function currentUser(token: string): string | undefined {
  return users.get(token);
}