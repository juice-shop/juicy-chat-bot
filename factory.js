/*
 * Copyright (c) 2020-2021 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable no-unused-vars */
/* global Nlp, training */
var trainingSet = training.data
const model = new Nlp({ languages: ['en'], nlu: { log: false }, autoSave: false, autoLoad: false, modelFileName: '' })
var users = {
  idmap: {},

  addUser: function (token, name) {
    this.idmap[token] = name
  },

  get: function (token) {
    return this.idmap[token]
  }
}

function train () {
  trainingSet.data.map((query) => {
    query.utterances.map((utterance) => {
      model.addDocument(trainingSet.lang, utterance, query.intent)
    })
    query.answers.map((answer) => {
      model.addAnswer(trainingSet.lang, query.intent, answer)
    })
  })
  return model.train().then(() => { training.state = true })
}

function process (query, token) {
  if (users.get(token)) {
    return model.process(trainingSet.lang, query)
  } else {
    return { action: 'unrecognized', body: 'user does not exist' }
  }
}

function currentUser (token) {
  return users.get(token)
}

/* eslint-enable no-unused-vars */
