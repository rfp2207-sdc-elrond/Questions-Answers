const models = require('./models.js');

const renameKey = ( object, oldKey, newKey ) => {
  object[newKey] = object[oldKey];
  delete object[oldKey];
}

const getA = async ( req, res ) => {
  let page = req.params.page || 1;
  let count = req.params.count || 5;

  let answerData = await models.getA( req.params.question_id, page, count );
  let ansRows = answerData.rows;

  for ( let i = 0; i < ansRows.length; i++ ) {
    let photoData = await models.getP(ansRows[i]['id']);
    renameKey(ansRows[i], 'id', 'answer_id');
    renameKey(ansRows[i], 'name', 'answerer_name');
    renameKey(ansRows[i], 'helpful', 'helpfulness');
    ansRows[i]['date'] = new Date(parseInt(ansRows[i]['date'])).toISOString();
    ansRows[i]['photos'] = photoData.rows;
  }

  let output = {
    "question": req.params.question_id,
    "page": page - 1,
    "count": count,
    "results": ansRows
  }

  res.send(output);
};

const postQ = ( req, res ) => {

};

module.exports.getA = getA;
module.exports.postQ = postQ;