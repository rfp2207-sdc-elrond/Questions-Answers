const { Questions, Answers } = require('./db.js');

const fillDBQuestions = ( questionData ) => {
  // questionID is handled by entry order
  const { questionID, productID, bodyQ, nameQ, emailQ, dateQ, helpfulQ, reportedQ } = questionData;
  console.log(bodyQ, nameQ);

  return Questions.create({
    questionID, productID, "body": bodyQ, "name": nameQ, "email": emailQ,
    "date": dateQ, "helpful": helpfulQ, "reported": reportedQ
  }).then(console.log('entry made?'));
}

const fillDBAnswers = ( answerData ) => {
  // answerID is handled by entry order
  const { answerID, questionID, bodyA, nameA, emailA, dateA, helpfulA, reportedA, photos } = answerData;

  const answerPromise = Answers.create({
   "body": bodyA, "name": nameA, "email": emailA,
    "date": dateA, "helpful": helpfulA, "reported": reportedA
  });

  const questionPromise = Questions.updateOne(
    { id: questionID },
    { $push: { answerIDs: answerID }}
    );

  return Promise.all([ answerPromise, questionPromise ]);
}

const fillDBPhotos = ( photosData ) => {
  const { answerID, url } = photosData;

  return Answers.updateOne(
    { id: answerID },
    { $push: { photos: url }}
    );

};

module.exports.fillDBQuestions = fillDBQuestions;
module.exports.fillDBAnswers = fillDBAnswers;
module.exports.fillDBPhotos = fillDBPhotos;