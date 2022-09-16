const promise = require('bluebird')
require("dotenv").config();

const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise);
};

const pgp = require('pg-promise')(initOptions);

const cn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 100
}

const db = pgp(cn);

const loadDB = async () => {
  console.log('Start Loading DB');
  db.any(
    `COPY question ( id, productID, body, date, name, email, reported, helpful )
    FROM '/Users/seanyoung/Documents/CEWork/SDC/Questions-Answers/init/questions.csv' DELIMITER ',' csv header;`
  ).then(()=>{
    console.log('Finished loading questions');
    db.any(
      `COPY answer ( id, questionID, body, date, name, email, reported, helpful )
      FROM '/Users/seanyoung/Documents/CEWork/SDC/Questions-Answers/init/answers.csv' DELIMITER ',' csv header;`
    ).then(() => {
      console.log('Finished loading answers');
      db.any(
        `COPY answer_photo ( id, answerID, url )
        FROM '/Users/seanyoung/Documents/CEWork/SDC/Questions-Answers/init/answers_photos.csv' DELIMITER ',' csv header;`
      ).then(() => { console.log('Finished loading photos')});
    });
  });
};

loadDB();