const express = require('express');
const os = require('os');

const app = express();

app.use(express.static('dist'));

app.post('/api/ping', (req, res) => res.json({ message: 'pong'}));
app.post('/api/submit', (req, res) => res.json({ message: 'success'}));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
