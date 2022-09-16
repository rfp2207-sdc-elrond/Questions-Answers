const db = require('./db.js');

const getA = async ( questionID, page, count ) => {
  const start = count * (page - 1);
  const values = [ 0, questionID, count, start ];

  return await db.query(
    `SELECT id, name, body, date, helpful FROM answer
    WHERE answer.reported = $1 AND answer.questionID = $2
    LIMIT $3 OFFSET $4;`,
  values );
};

const getP = async ( answerID ) => {
  return await db.query(
    `SELECT id, url FROM answer_photo
    WHERE answer_photo.answerID = $1;`,
  [ answerID ]);
};

const postQ = async ( productID, body, name, email ) => {
  const values = [ productID, name, email, body, new Date().getTime(), 0, 0 ]
  return await db.query(
    `INSERT INTO question ( productID, name, email, body, date, helpful, reported )
    VALUES ( $1, $2, $3, $4, $5, $6, $7 )`,
  values );
};

module.exports.getA = getA;
module.exports.getP = getP;
module.exports.postQ = postQ;