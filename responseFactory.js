context = {
    training_set: null,
    response_set: null,

    process(query) {
        return global.response_set[query];
    },

    debug() {
        return this.training_set
    },

    train() {
        global.response_set = global.training_set;
    }
}

exports.context = context;