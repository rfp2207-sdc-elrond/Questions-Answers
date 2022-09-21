const models = require('./models.js');

/*-----------------------------------------
Common Helper Functions
-----------------------------------------*/
const renameKey = async ( object, oldKey, newKey ) => {
  object[newKey] = object[oldKey];
  delete object[oldKey];
};

/*-----------------------------------------
QUESTIONS
-----------------------------------------*/
const getQ = async ( req, res ) => {
  try {
    let { product_id, page = 1, count = 5 } = req.query;
    if ( !(/^[0-9]+$/.test(product_id)) ) {
      throw new Error();
    }
    let questionData = await models.getQ( product_id, page, count );
    // add answers data to questions using question_ids
    for ( let j = 0; j < questionData.length; j++ ) {
      let answerData = await models.getA(questionData[j]['question_id'])
      questionData[j]['reported'] = false ;
      questionData[j]['answers'] = {};
      for ( let k = 0; k < answerData.length; k++ ) {
        renameKey(answerData[k], 'answer_id', 'id')
        questionData[j]['answers'][ answerData[k]['id'] ] = answerData[k];
      }
    }
    // package data neatly
    let payload = { 'product_id': product_id, "results": questionData };
    // return payload
    res.send(payload);
  } catch (err) {
    // log error to file?
    console.log(err);
    res.sendStatus(500);
  }
};

const postQ = async ( req, res ) => {
  try {
    let { product_id, name, email,  body } = req.body;
    if ( !(/^[0-9]+$/.test(product_id)) ) {
      throw new Error();
    }
    await models.postQ( product_id, name, email, body );
    res.sendStatus(201);
  } catch (err) {
    // log error to file?
    res.sendStatus(501);
  }
};

const putQH = async ( req, res ) => {
  try {
    let { question_id } = req.params;
    if ( !(/^[0-9]+$/.test(question_id)) ) {
      throw new Error();
    }
    await models.putQH( question_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(502);
  }
};

const putQR = async ( req, res ) => {
  try {
    let { question_id } = req.params;
    if ( !(/^[0-9]+$/.test(question_id)) ) {
      throw new Error();
    }
    await models.putQR( question_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(503);
  }
};

/*-----------------------------------------
ANSWERS
-----------------------------------------*/
const getA = async ( req, res ) => {
  try {
    let { page = 1, count = 5 } = req.query;
    let { question_id } = req.params;
    if ( !(/^[0-9]+$/.test(question_id)) ) {
      throw new Error();
    }
    let answerData = await models.getA( question_id, page, count );
    // add additional data
    for ( let i = 0; i < answerData.length; i++ ) {
      let id = answerData[i]['answer_id'] || answerData[i]['id']
      let photoData = await models.getP(id);
      answerData[i]['photos'] = photoData;
    }
    // package data neatly
    let payload = {
      "question": question_id,
      "page": page - 1,
      "count": count,
      "results": answerData
    }
    // return payload
    res.send(payload);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const postA = async ( req, res ) => {
  try {
    let { question_id } = req.params;
    if ( !(/^[0-9]+$/.test(question_id)) ) {
      throw new Error();
    }
    let { name, email, body, photos } = req.body;
    await models.postA( question_id, name, email, body, photos );
    res.sendStatus(201);
  } catch (err) {
    // log error to file?
    res.sendStatus(501);
  }
};

const putAH = async ( req, res ) => {
  try {
    let { answer_id } = req.params;
    if ( !(/^[0-9]+$/.test(answer_id)) ) {
      throw new Error();
    }
    await models.putAH( answer_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(502);
  }
};

const putAR = async ( req, res ) => {
  try {
    let { answer_id } = req.params;
    if ( !(/^[0-9]+$/.test(answer_id)) ) {
      throw new Error();
    }
    await models.putAR( answer_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(503);
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