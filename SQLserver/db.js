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

let createTables = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS question (
      id SERIAL PRIMARY KEY,
      productID INT,
      name VARCHAR(100),
      email VARCHAR(255),
      body TEXT,
      date BIGINT,
      helpful INT,
      reported INT
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS answer (
      id SERIAL PRIMARY KEY,
      questionID INT REFERENCES question(id),
      name VARCHAR(100),
      email VARCHAR(255),
      body TEXT,
      date BIGINT,
      helpful INT,
      reported INT
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS answer_photo (
      id SERIAL PRIMARY KEY,
      answerID INT REFERENCES answer(id),
      url TEXT
    )`
  );
};

try {
  createTables();
  console.log('Tables exist!')
} catch (error) {
  console.log(error);
}