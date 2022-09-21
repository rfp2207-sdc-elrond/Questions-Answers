require("dotenv").config();
const path = require("path");
const controllers = require('./controllers.js');
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Establishes connection to the database on server start
const db = require("./db");

// Middleware Here
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes Here
app.get('/qa/questions', controllers.getQ);
app.post('/qa/questions', controllers.postQ);
app.put('/qa/questions/:question_id/helpful', controllers.putQH);
app.put('/qa/questions/:question_id/report', controllers.putQR);

app.get('/qa/questions/:question_id/answers', controllers.getA);
app.post('/qa/questions/:question_id/answers', controllers.postA);
app.put('/qa/answers/:answer_id/helpful', controllers.putAH);
app.put('/qa/answers/:answer_id/report', controllers.putAR);


app.listen(process.env.SERVER_PORT);
console.log(`Listening at http://localhost:${process.env.SERVER_PORT}`);