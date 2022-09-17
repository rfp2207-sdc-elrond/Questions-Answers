const express = require("express");
const path = require("path");
const controllers = require('./controllers.js');

const app = express();

app.use(express.json());

// Routes
app.post('/fillDBQuestions', controllers.fillDBQuestions);
app.post('/fillDBAnswers', controllers.fillDBAnswers);
app.post('/fillDBPhotos', controllers.fillDBPhotos);


let PORT = 3000;
app.listen(PORT);
console.log(`Listening at http://localhost:${PORT}`);