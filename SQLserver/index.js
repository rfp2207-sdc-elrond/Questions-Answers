require("dotenv").config();
const express = require("express");
const path = require("path");
const controllers = require('./controllers.js');

// Establishes connection to the database on server start
const db = require("./db");

const app = express();
app.use(express.json());

// Routes Here
app.get('/qa/questions/:question_id/answers', controllers.getA);
app.get('/qa/questions', controllers.getQ);
// app.post('/qa/questions', controllers.postQ);

app.listen(process.env.SERVER_PORT);
console.log(`Listening at http://localhost:${process.env.SERVER_PORT}`);