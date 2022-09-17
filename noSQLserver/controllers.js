const models = require('./models.js');

const fillDBQuestions = ( data ) => {
  console.log('Received Initial Fill DB Questions Request');
  // process data from req
  let questionData = {
    questionID: data.question_id,
    productID: data.product_id,
    bodyQ: data.body,
    nameQ: data.asker_name,
    emailQ: data.asker_email,
    dateQ: data.date_written,
    helpfulQ: data.helpful,
    reportedQ: data.reported
  };

  models.fillDBQuestions(questionData)
  .then((success) => {console.log('success', success)})
  .catch((err) => {console.log('FAILURE', err)});

}

// const fillDBQuestions = ( req, res ) => {
//   console.log('Received Initial Fill DB Questions Request');
//   // process data from req
//   let questionData = {
//     productID: req.body.product_id,
//     bodyQ: req.body.body,
//     nameQ: req.body.asker_name,
//     emailQ: req.body.asker_email,
//     dateQ: req.body.date_written,
//     helpfulQ: req.body.helpful,
//     reportedQ: req.body.reported
//   };

//   console.log(req.body);
//   console.log(questionData);

//   res.sendStatus(500);

//   // return models.fillDBQuestions(questionData)
//   //   .then((success) => {
//   //     res.sendStatus(201);
//   //   })
//   //   .catch((err) => {
//   //     res.sendStatus(500);
//   //   });
// };

const fillDBAnswers = ( req, res ) => {
  console.log('Received Initial Fill DB Answers Request');
  console.log('body', req.body);
  console.log('params', req.params);

  res.sendStatus(500);

  // return models.fillDBAnswers(/* Fill in variables data here */)
  //   .then((success) => {
  //     res.sendStatus(201);
  //   })
  //   .catch((err) => {
  //     res.sendStatus(500);
  //   });
};

const fillDBPhotos = ( req, res ) => {
  console.log('Received Initial Fill DB Photos Request');
  console.log('body', req.body);
  console.log('params', req.params);

  res.sendStatus(500);

  // return models.fillDBPhotos(/* Fill in variables data here */)
  //   .then((success) => {
  //     res.sendStatus(201);
  //   })
  //   .catch((err) => {
  //     res.sendStatus(500);
  //   });
};

module.exports.fillDBQuestions = fillDBQuestions;
module.exports.fillDBAnswers = fillDBAnswers;
module.exports.fillDBPhotos = fillDBPhotos;
