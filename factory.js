/* eslint-disable no-unused-vars */
/* global nlp */
var trainingSet
var responseSet
console.log(nlp)
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
  global.responseSet = global.trainingSet
}

function process (query, token) {
  if (users.get(token)) {
    return { action: 'response', message: responseSet[query] }
  } else {
    return { action: 'unrecognized', message: 'user does not exist' }
  }
}

function currentUser (token) {
  return users.idmap[token]
}

/* eslint-enable no-unused-vars */
