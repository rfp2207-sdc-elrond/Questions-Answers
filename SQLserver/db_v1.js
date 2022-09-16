require("dotenv").config();
const pgp = require('pg-promise')({
  capSQL: true
});

const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const createTables = () => {
  db.any(
    `CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    productID INT,
    name VARCHAR(100),
    email VARCHAR(255),
    body TEXT,
    date BIGINT,
    helpful INT,
    reported INT
    )`)
  .then((data) => {
    console.log('created questions table if non-existant');
    db.any(
      `CREATE TABLE IF NOT EXISTS answer (
      id SERIAL PRIMARY KEY,
      questionID INT REFERENCES question(id),
      name VARCHAR(100),
      email VARCHAR(255),
      body TEXT,
      date BIGINT,
      helpful INT,
      reported INT
      )`)
  })
  .then((data) => {
    console.log('created answers table if non-existant');
    db.any(
      `CREATE TABLE IF NOT EXISTS answer_photo (
        id SERIAL PRIMARY KEY,
        answerID INT REFERENCES answer(id),
        url TEXT
      )`)
    .then((data) => {console.log('created photos table if non-existant')})
  })
  .catch((err) => {
    console.log(err);
  });
};
createTables();

module.exports = db;