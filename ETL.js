require("dotenv").config();
const { Pool } = require ('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

const loadDB = async () => {
  console.log('Start Loading DB');

  await pool.query(
    `COPY question ( id, productID, body, date, name, email, reported, helpful )
    FROM '/Users/seanyoung/Documents/CEWork/SDC/Questions-Answers/init/questions.csv' DELIMITER ',' csv header;`
  ).then(()=>{console.log('Finished loading questions')});

  await pool.query(
    `COPY answer ( id, questionID, body, date, name, email, reported, helpful )
    FROM '/Users/seanyoung/Documents/CEWork/SDC/Questions-Answers/init/answers.csv' DELIMITER ',' csv header;`
  ).then(() => {console.log('Finished loading answers')});

  await pool.query(
    `COPY answer_photo ( id, answerID, url )
    FROM '/Users/seanyoung/Documents/CEWork/SDC/Questions-Answers/init/answers_photos.csv' DELIMITER ',' csv header;`
  ).then(() => { console.log('Finished loading photos')});

};

try {
  loadDB();
} catch (error) {
  console.log(error);
} finally {
  console.log('DB Filled!')
}