const models = require('./models.js');

/*-----------------------------------------
QUESTIONS
-----------------------------------------*/
const getQ = async ( req, res ) => {
  try {
    let { product_id, page = 1, count = 5 } = req.query;
    let questionData = await models.getQ( product_id, page, count );
    let output = { 'product_id': product_id, "results": questionData };
    res.send(output);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const postQ = async ( req, res ) => {
  try {
    let { product_id, name, email,  body } = req.body;
    await models.postQ( product_id, name, email, body );
    res.sendStatus(201);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const putQH = async ( req, res ) => {
  try {
    let { question_id } = req.params;
    await models.putQH( question_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const putQR = async ( req, res ) => {
  try {
    let { question_id } = req.params;
    await models.putQR( question_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

/*-----------------------------------------
ANSWERS
-----------------------------------------*/
const getA = async ( req, res ) => {
  try {
    let { page = 1, count = 5 } = req.query;
    let { question_id } = req.params;
    let answerData = await models.getA( question_id, page, count );
    res.send(answerData);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const postA = async ( req, res ) => {
  try {
    let { question_id } = req.params;
    let { name, email, body, photos } = req.body;
    await models.postA( question_id, name, email, body, photos );
    res.sendStatus(418);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const putAH = async ( req, res ) => {
  try {
    let { answer_id } = req.params;
    await models.putAH( answer_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
  }
};

const putAR = async ( req, res ) => {
  try {
    let { answer_id } = req.params;
    await models.putAR( answer_id );
    res.sendStatus(204);
  } catch (err) {
    // log error to file?
    res.sendStatus(500);
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