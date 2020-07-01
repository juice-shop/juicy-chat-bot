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
  trainingSet.intents.map((query) => {
    model.addDocument(trainingSet.lang, query.question, query.intent)
  })
  trainingSet.answers.map((query) => {
    model.addAnswer(trainingSet.lang, query.intent, query.answer)
  })
  return model.train().then(() => { training.state = true })
}

function process (query, token) {
  if (users.get(token)) {
    return { action: 'response', body: model.process(trainingSet.lang, query) }
  } else {
    return { action: 'unrecognized', body: 'user does not exist' }
  }
}

function currentUser (token) {
  return users.get(token)
}

/* eslint-enable no-unused-vars */
