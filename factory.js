training_set = null;
response_set = null;

function process(query) {
    return global.response_set[query];
}

function train() {
    global.response_set = global.training_set
}
