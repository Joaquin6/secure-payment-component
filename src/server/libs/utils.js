const rand = () => Math.random().toString(36).substr(2); // remove `0.`

exports.generateRandomToken = () =>
    "tk_" + rand() + rand() + rand();