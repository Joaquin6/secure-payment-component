const express = require('express');
const os = require('os');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/ping', (req, res) => res.json({ message: 'pong'}));
app.post('/api/submit', (req, res) => {
    console.log(req.body);

    res.status(200).json({
        data: {last4: req.body.cardNumber.slice(-4), ...req.body }, 
        message: 'payment-success'
    });
});
app.get('/api/getUsername', (req, res) => 
    res.send({ username: os.userInfo().username }));

app.listen(process.env.PORT || 8080, () => 
    console.log(`Listening on port ${process.env.PORT || 8080}!`));
