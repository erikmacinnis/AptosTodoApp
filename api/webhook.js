// Example webhook endpoint with Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the root URL!');
});

let leaderboardData = null;

// app.post('/leaderboard', (req, res) => {
//     const leaderboard = req.body;

//     // Update the leaderboardData
//     leaderboardData = leaderboard;

//     // Process the payload and trigger actions in your application
//     console.log('GitHub Event Received:', leaderboard);
//     res.status(200).send('Webhook Received');

// });

app.get('/leaderboardData', (req, res) => {
    res.status(200).send(JSON.stringify(leaderboardData))
})

app.listen(port, () => {
    console.error(`Webhook server listening at http://localhost:${port}`);
});