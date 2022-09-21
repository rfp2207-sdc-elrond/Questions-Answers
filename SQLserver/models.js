const db = require('./db.js');

/*-----------------------------------------
Cache Storage
-----------------------------------------*/
let questions = {}; // productID: []
let answers = {}; // questionID: []
let photos = {}; // answerID : []

/*-----------------------------------------
Common Helper Functions
-----------------------------------------*/
const addToStorage = async ( storage, key, data ) => {
  data = data.rows;
  if ( storage[key] === undefined ) { storage[key] = [] }; // if DNE, creates new container
  for ( let i = 0; i < data.length; i++ ) {
    if (data[i]['date']) { data[i]['date'] = new Date(parseInt(data[i]['date'])).toISOString() };
    if (data[i]['question_date']) { data[i]['question_date'] = new Date(parseInt(data[i]['question_date'])).toISOString() };
    storage[key].push(data[i]);
  }; // if results, adds results to container in memory
};

const getP = async ( answerID ) => {
  try {
    // if not in memory, then query DB & add to memory
    if (!photos[answerID]) {
      // if can't, then call DB
      let photoData = await db.query(
        `SELECT id, url FROM answer_photo
        WHERE answer_photo.answerID = ${answerID};`
      );
      // add results of DB call to memory
      addToStorage( photos, answerID, photoData );
    }
    return photos[answerID]; // return from memory
  } catch (err) {
    // log error to file?
    console.log('there was an error getP', err)
    return;
  }
};

const postP = async ( answerID, photos ) => {
  try {
    // create string to add each photo into query
    let string = '';
    if ( photos === undefined || photos === null ) { photos = [] };
    // loop through all entries to add to string
    for ( let i = 0; i < photos.length; i++ ) {
      string = string + `('${answerID}', '${photos[i]}'), `;
      if ( i === photos.length - 1 ) {
        string = string.substring(0, string.length - 2);
      }
    }
    // if string is actually something worth posting to DB
    if ( string.length > 0 ) {
      // post to DB
      await db.query(
        `INSERT INTO answer_photo ( answerID, url )
        VALUES ${string};`
      )
      // erase answerID entry in memory {photos}
      delete photos[answerID];
    }
  } catch (err) {
    // log error to file?
    console.log('there was an error postP', err)
    return;
  }
};

/*-----------------------------------------
QUESTIONS
-----------------------------------------*/
const getQ = async ( productID, page, count ) => {
  try {
    let start = count * (page - 1);
    questionRows = [];
    // if not in memory, then query db & place it into memory
    if ( !questions[productID] ) {
      let questionData =  await db.query(
      `SELECT id as question_id, name as asker_name, body as question_body, date as question_date, helpful as question_helpfulness FROM question
      WHERE question.reported = ${0} AND question.productid = ${productID}
      ORDER BY helpful DESC
      LIMIT ${count} OFFSET ${start};`
      );
      // add to Storage
      addToStorage(questions, productID, questionData);
    };
    // obtain data from memory
    questionRows = JSON.parse(JSON.stringify(questions[productID].slice(start, start + count)));
    return questionRows;
  } catch (err) {
    // log error to file?
    console.log('there was an error getQ', err)
    return;
  }
}

const postQ = async ( productID, name, email, body ) => {
  try {
    await db.query(
      `INSERT INTO question ( productID, name, email, body, date, helpful, reported )
      VALUES ( ${productID}, '${name}', '${email}', '${body}', ${new Date().getTime()}, ${0}, ${0} );`
    );
    delete questions[productID];
  } catch (err) {
    // log error to file?
    console.log('there was an error postQ', err)
    return;
  }
};

const putQH = async ( questionID ) => {
  try {
    let productID = await db.query(
      `UPDATE question
      SET helpful =
        (
          SELECT helpful + 1 FROM question
          WHERE question.id = $1
        )
      WHERE question.id = $1
      RETURNING productID;`,
    [ questionID ]);
    productID = productID.rows[0]['productid']
    delete questions[productID];
  } catch (err) {
    // log error to file?
    console.log('there was an error putQH', err)
    return;
  }
};

const putQR = async ( questionID ) => {
  try {
    let productID = await db.query(
      `UPDATE question
      SET reported =
        (
          SELECT reported + 1 FROM question
          WHERE question.id = $1
        )
      WHERE question.id = $1
      RETURNING productID;`,
    [ questionID ]);
    productID = productID.rows[0]['productid']
    delete questions[productID];
  } catch (err) {
    // log error to file?
    console.log('there was an error putQR', err)
    return;
  }
};

/*-----------------------------------------
ANSWERS
-----------------------------------------*/
const getA = async ( questionID, page = 1 , count = 5 ) => {
  try {
    let start = count * (page - 1);
    let ansRows = [];
    // if not in memory, then query the db & place it in memory
    if ( !answers[questionID] ) {
      // if can't, then query the db
      let answerData =  await db.query(
        `SELECT id as answer_id, name as answerer_name, body, date, helpful as helpfulness FROM answer
        WHERE answer.reported = ${0} AND answer.questionID = ${questionID}
        ORDER BY helpful DESC;`
      );
      // add answers data to memory {answers}
      addToStorage( answers, questionID, answerData );
    }
    // get data from memory
    ansRows = JSON.parse(JSON.stringify(answers[questionID].slice(start, start + count)));
    return ansRows;

  } catch (err) {
    // log error to file?
    console.log('there was an error getA', err)
    return;
  }
};

const postA = async ( questionID, name, email, body, photos ) => {
  try {
    // insert into answer table
    let answerID = await db.query(
      `INSERT INTO answer ( questionID, name, email, body, date, helpful, reported )
      VALUES ( ${questionID}, '${name}', '${email}', '${body}', ${new Date().getTime()}, ${0}, ${0} )
      RETURNING id AS answerID;`
    );
    answerID = answerID.rows[0]['answerid'];
    await postP(answerID, photos);
    // erase questionID entry in memory {answers}
    delete answers[questionID];
  } catch (err) {
    // log error to file?
    console.log('there was an error postA', err)
    return;
  }
};

const putAH = async ( answerID ) => {
  try {
    let questionID = await db.query(
      `UPDATE answer
      SET helpful =
        (
          SELECT helpful + 1 FROM answer
          WHERE answer.id = $1
        )
      WHERE answer.id = $1
      RETURNING questionID;`,
    [ answerID ]);
    questionID = questionID.rows[0]['questionid']
    // erase questionID entry in memory {answers}
    delete answers[questionID];
  } catch (err) {
    // log error to file?
    console.log('there was an error putAH', err)
    return;
  }
};

const putAR = async ( answerID ) => {
  try {
    let questionID = await db.query(
    `UPDATE answer
    SET reported =
      (
        SELECT reported + 1 FROM answer
        WHERE answer.id = $1
      )
    WHERE answer.id = $1
    RETURNING questionID;`,
    [ answerID ]);
    questionID = questionID.rows[0]['questionid']
    // erase questionID entry in memory {answers}
    delete answers[questionID];
  } catch (err) {
    // log error to file?
    console.log('there was an error putAR', err)
    return;
  }
};

module.exports.getP = getP;
module.exports.postP = postP;

module.exports.getQ = getQ;
module.exports.postQ = postQ;
module.exports.putQH = putQH;
module.exports.putQR = putQR;

module.exports.getA = getA;
module.exports.postA = postA;
module.exports.putAH = putAH;
module.exports.putAR = putAR;