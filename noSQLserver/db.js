const mongoose = require("mongoose");
// 1. Use mongoose to establish a connection to MongoDB
mongoose.connect('mongodb://localhost/questionanswers');

// 2. Set up any schema and models needed by the app
let questionsSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  productID: Number,
  body: String,
  name: String,
  email: String,
  date: Date,
  helpful: Number,
  reported: Number,

  answerIDs: Array // of answer IDs
});

let answersSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  body: String,
  name: String,
  email: String,
  date: Date,
  helpful: Number,
  reported: Number,

  photos: Array // of urls
});

let Questions = mongoose.model('Questions', questionsSchema);
let Answers = mongoose.model('Answers', answersSchema);


module.exports.Questions = Questions;
module.exports.Answers = Answers;