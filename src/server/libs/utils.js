const rand = () => Math.random().toString(36).substr(2); // remove `0.`

exports.generateRandomToken = () =>
    "tk_" + rand() + rand() + rand();

exports.findPayment = (payments, token) => {
    for (let index = 0; index < payments.length; index++) {
        const payment = payments[index];
        if (payment.token === token) return payment;
    }
    return null;
}; 