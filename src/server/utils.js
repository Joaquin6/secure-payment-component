const rand = () => Math.random().toString(36).substr(2); // remove `0.`

exports.generateRandomToken = () =>
    "test_key_" + rand() + rand() + rand();