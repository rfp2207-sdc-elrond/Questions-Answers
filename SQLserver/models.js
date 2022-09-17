const db = require('./db.js');

const renameKey = ( object, oldKey, newKey ) => {
  object[newKey] = object[oldKey];
  delete object[oldKey];
}

const getA = async ( questionID, page = 1 , count = 5 ) => {
  const start = count * (page - 1);
  const values = [ 0, questionID, count, start ];

  let answerData =  await db.query(
    `SELECT id, name, body, date, helpful FROM answer
    WHERE answer.reported = $1 AND answer.questionID = $2
    LIMIT $3 OFFSET $4;`,
  values );

  let ansRows = answerData.rows;
  for ( let i = 0; i < ansRows.length; i++ ) {
    let photoData = await db.query(
      `SELECT id, url FROM answer_photo
      WHERE answer_photo.answerID = $1;`,
    [ ansRows[i]['id'] ]);
    renameKey(ansRows[i], 'id', 'answer_id');
    renameKey(ansRows[i], 'name', 'answerer_name');
    renameKey(ansRows[i], 'helpful', 'helpfulness');
    ansRows[i]['date'] = new Date(parseInt(ansRows[i]['date'])).toISOString();
    ansRows[i]['photos'] = photoData.rows;
  }

  let output = {
    "question": questionID,
    "page": page - 1,
    "count": count,
    "results": ansRows
  }

  return output;
};

const getQ = async ( productID, page, count ) => {
  const start = count * (page - 1);

  let questionData =  await db.query(
    `SELECT id, name, body, date, helpful, reported FROM question
    WHERE question.reported = $1 AND question.productid = $2
    LIMIT $3 OFFSET $4;`,
  [ 0, productID, count, start ] );

  let questionRows = questionData.rows;
  for ( let j = 0; j < questionRows.length; j++ ) {
    let ansData = await getA(questionRows[j]['id'])
    ansData = ansData.results;

    renameKey(questionRows[j], 'id', 'question_id');
    renameKey(questionRows[j], 'body', 'question_body');
    questionRows[j]['date'] = new Date(parseInt(questionRows[j]['date'])).toISOString();
    renameKey(questionRows[j], 'date', 'question_date');
    renameKey(questionRows[j], 'name', 'asker_name');
    renameKey(questionRows[j], 'helpful', 'question_helpfulness');
    if (!questionRows[j]['reported']) {questionRows[j]['reported'] = false };
    questionRows[j]['answers'] = {};

    for ( let k = 0; k < ansData.length; k++ ) {
      renameKey(ansData[k], 'answer_id', 'id')
      questionRows[j]['answers'][ ansData[k]['id'] ] = ansData[k];
    }
  }

  return questionRows;
}

const postQ = async ( productID, body, name, email ) => {
  const values = [ productID, name, email, body, new Date().getTime(), 0, 0 ]
  return await db.query(
    `INSERT INTO question ( productID, name, email, body, date, helpful, reported )
    VALUES ( $1, $2, $3, $4, $5, $6, $7 )`,
  values );
};

module.exports.getA = getA;
module.exports.getQ = getQ;
module.exports.postQ = postQ;