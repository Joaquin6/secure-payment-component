const express = require('express');
const os = require('os');
const Utils = require('./utils');

const submittedPayments = [];
const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/ping', (req, res) => res.json({ message: 'pong'}));
app.post('/api/submit', (req, res) => {
    console.log('\nSubmitted Body: \n\t', req.body);

    const resObj = {
        last4: req.body.cardNumber.slice(-4),
        token: Utils.generateRandomToken() 
    };
    submittedPayments.push(resObj);
    res.status(200).json(resObj);
});
app.get('/api/getUsername', (req, res) => 
    res.send({ username: os.userInfo().username }));

app.listen(process.env.PORT || 8080, () => 
    console.log(`Listening on port ${process.env.PORT || 8080}!`));

process.on('uncaughtException', (err) => {
    console.error('Caught exception: ' + err);
});