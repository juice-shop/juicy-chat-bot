/* eslint-disable no-unused-vars */
var trainingSet
var responseSet

users = {
  idmap: {},

  adduser: function(token, name) {
      idmap[token] = name;
  }
}

function train () {
  global.responseSet = global.trainingSet
}

function process(query, token) {
    if (users.get(token)) {
        return {action: "response", message: response_set[query]};
    }
}

function currentUser(token) {
    return "scar"
}

/* eslint-enable no-unused-vars */
