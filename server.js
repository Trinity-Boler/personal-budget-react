// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors());


const budget = require('./budget');


// app.get('/hello', (req, res) => {
//     res.send('Welcome to the Budget API');
// });

app.get('/budget', (req, res) => {
    res.json(budget);
});
app.use('/', express.static('public'));


app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});