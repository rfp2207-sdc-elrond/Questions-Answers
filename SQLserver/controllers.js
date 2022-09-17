const models = require('./models.js');

const getA = async ( req, res ) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  let answerData = await models.getA( req.params.question_id, page, count );
  res.send(answerData);
};

const getQ = async ( req, res ) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  let questionData = await models.getQ( req.query.product_id, page, count );
  let output = {
    'product_id': req.query.product_id,
    "results": questionData
  }

  res.send(output);
};

const postQ = ( req, res ) => {

};

module.exports.getA = getA;
module.exports.getQ = getQ;
module.exports.postQ = postQ;