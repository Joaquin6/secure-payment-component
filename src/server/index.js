const express = require('express');
const os = require('os');
const cors = require('cors');

const Utils = require('./libs/utils');

const submittedPayments = [];
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/hello', (req, res) => res.json({ message: 'Hello World' }));
app.get('/api/username', (req, res) => res.send({ username: os.userInfo().username }));
app.post('/api/ping', (req, res) => res.json({ message: 'pong'}));
app.post('/api/submit', (req, res) => {
    try {
        const payload = req.body;
        console.log('\nSubmitted Body: \n\t', payload);

        if (!payload.cardNumber) {
            throw new Error('Missing required field cardNumber');
        }
        if (!payload.expiryDate) {
            throw new Error('Missing required field expiryDate');
        }

        const resObj = {
            last4: payload.cardNumber.slice(-4),
            token: Utils.generateRandomToken() 
        };
        submittedPayments.push(resObj);
        res.status(200).json(resObj);
    } catch (error) {
        console.log('error:', error);

        res.status(400).json({
            data: 'Payment failed.'
        });
    }
});
app.get('/api/payments/:token', (req, res) => {
    try {
        const { token } = req.params;
        const foundPayment = Utils.findPayment(submittedPayments, token);
        
        if (!foundPayment) {
            throw new Error('Provided payment token does not exist.');
        }

        res.status(200).json(foundPayment);
    } catch (error) {
        console.log('error:', error);
        res.status(400).json({ data: 'Payment does not exist.' });
    }
});
// Error handling
app.get('/api/error', (req, res) => {
  throw new Error('Test error');
});
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT || 8080, () => 
    console.log(`Listening on port ${process.env.PORT || 8080}!`));

process.on('uncaughtException', (err) => {
    console.error('Caught exception: ' + err);
});

module.exports = app;