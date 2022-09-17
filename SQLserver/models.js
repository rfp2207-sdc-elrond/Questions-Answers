const db = require('./db.js');

/*-----------------------------------------
Common Helper Functions
-----------------------------------------*/
const renameKey = ( object, oldKey, newKey ) => {
  object[newKey] = object[oldKey];
  delete object[oldKey];
}

const getP = async ( answerID ) => {
  try {
    return await db.query(
      `SELECT id, url FROM answer_photo
      WHERE answer_photo.answerID = ${answerID};`
    );
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
}

/*-----------------------------------------
QUESTIONS
-----------------------------------------*/
const getQ = async ( productID, page, count ) => {
  try {
    const start = count * (page - 1);

    let questionData =  await db.query(
      `SELECT id as question_id, name as asker_name, body as question_body, date as question_date, helpful as question_helpfulness, reported FROM question
      WHERE question.reported = ${0} AND question.productid = ${productID}
      ORDER BY helpful DESC
      LIMIT ${count} OFFSET ${start};`
    );

    let questionRows = questionData.rows;
    for ( let j = 0; j < questionRows.length; j++ ) {
      let ansData = await getA(questionRows[j]['question_id'])
      ansData = ansData.results;

      questionRows[j]['question_date'] = new Date(parseInt(questionRows[j]['question_date'])).toISOString();
      if (!questionRows[j]['reported']) {questionRows[j]['reported'] = false };
      questionRows[j]['answers'] = {};

      for ( let k = 0; k < ansData.length; k++ ) {
        renameKey(ansData[k], 'answer_id', 'id')
        questionRows[j]['answers'][ ansData[k]['id'] ] = ansData[k];
      }
    }
    return questionRows;
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
}

const postQ = async ( productID, name, email, body ) => {
  try {
    return await db.query(
      `INSERT INTO question ( productID, name, email, body, date, helpful, reported )
      VALUES ( ${productID}, ${name}, ${email}, ${body}, ${new Date().getTime()}, ${0}, ${0} );`
    );
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

const putQH = async ( questionID ) => {
  try {
    return await db.query(
      `UPDATE question
      SET helpful =
        (
          SELECT helpful + 1 FROM question
          WHERE question.id = $1
        )
      WHERE question.id = $1;`,
    [ questionID ]);
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

const putQR = async ( questionID ) => {
  try {
    return await db.query(
      `UPDATE question
      SET reported =
        (
          SELECT reported + 1 FROM question
          WHERE question.id = $1
        )
      WHERE question.id = $1;`,
    [ questionID ]);
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

/*-----------------------------------------
ANSWERS
-----------------------------------------*/
const getA = async ( questionID, page = 1 , count = 5 ) => {
  try {
    const start = count * (page - 1);
  // const values = [ 0, questionID, count, start ];

    let answerData =  await db.query(
      `SELECT id as answer_id, name as answerer_name, body, date, helpful as helpfulness FROM answer
      WHERE answer.reported = ${0} AND answer.questionID = ${questionID}
      ORDER BY helpful DESC
      LIMIT ${count} OFFSET ${start};`
    );

    let ansRows = answerData.rows;
    for ( let i = 0; i < ansRows.length; i++ ) {
      let photoData = await getP(ansRows[i]['answer_id']);
      ansRows[i]['date'] = new Date(parseInt(ansRows[i]['date'])).toISOString();
      ansRows[i]['photos'] = photoData.rows;
    }

    let ansData = {
      "question": questionID,
      "page": page - 1,
      "count": count,
      "results": ansRows
    }

    return ansData;
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

const postA = async ( questionID, name, email, body, photos ) => {
  try {
    // insert into answer table
    let date = new Date().getTime();
    console.log(questionID, name, email, body, date);
    let answerID = await db.query(
      `INSERT INTO answer ( questionID, name, email, body, date, helpful, reported )
      VALUES ( ${questionID}, '${name}', '${email}', '${body}', ${date}, ${0}, ${0} )
      RETURNING id as answerID;`
    );
    answerID = answerID.rows[0]['answerid'];
    // create string to add each photo into query
    let string = '';
    // loop through all entries to add to string
    for ( let i = 0; i < photos.length; i++ ) {
      string = string + `('${answerID}', '${photos[i]}'), `;
    }
    string = string.substring(0, string.length - 2);
    let x = await db.query(
      `INSERT INTO answer_photo ( answerID, url )
      VALUES ${string};`
    );
      return;
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

const putAH = async ( answerID ) => {
  try {
    return await db.query(
      `UPDATE answer
      SET helpful =
        (
          SELECT helpful + 1 FROM answer
          WHERE answer.id = $1
        )
      WHERE answer.id = $1;`,
    [ answerID ]);
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

const putAR = async ( answerID ) => {
  try {
    return await db.query(
    `UPDATE answer
      SET reported =
        (
          SELECT reported + 1 FROM answer
          WHERE answer.id = $1
        )
      WHERE answer.id = $1;`,
    [ answerID ]);
  } catch (err) {
    // log error to file?
    console.log('there was an error', err)
    return err;
  }
};

module.exports.getQ = getQ;
module.exports.postQ = postQ;
module.exports.putQH = putQH;
module.exports.putQR = putQR;

module.exports.getA = getA;
module.exports.postA = postA;
module.exports.putAH = putAH;
module.exports.putAR = putAR;