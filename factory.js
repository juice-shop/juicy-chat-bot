/* eslint-disable no-unused-vars */
var trainingSet
var responseSet

function process (query) {
  return global.responseSet[query]
}

function train () {
  global.responseSet = global.trainingSet
}

function currentUser(token) {
    return "scar"
}

/* eslint-enable no-unused-vars */
