let User = require("../models/users");
let Question = require("../models/questions");
let Tag = require("../models/tags");

let handleGetUser = async (req, res) => {
  let user = await User.findOne({ username: req.body.user });
  let questions = await get_questions(req.body.user);
  let answers = await get_questions_answered(user);
  // let answers = await get_questions_answered(user);
  let updatedQuestions = [];
  for (let i = questions.length - 1; i >= 0; i--) {
    updatedQuestions.push(questions[i]);
  }
  let updatedAnswers = [];
  for (let i = answers.length - 1; i >= 0; i--) {
    updatedAnswers.push(answers[i]);
  }
  res.send({
    user: user,
    questionsAsk: updatedQuestions,
    questionsAnswer: updatedAnswers,
  });
};

let get_questions = async function (username) {
  let questionsFromDB = await Question.find({ asked_by: username });
  let counter = 1;
  let questions = questionsFromDB.map(function (question) {
    return {
      qid: "q" + counter++,
      id: question.id,
      title: question.title,
      summary: question.summary,
      text: question.text,
      tagIds: question.tags,
      askedBy: question.asked_by,
      askDate: question.ask_date_time,
      ansIds: question.answers,
      views: question.views,
      votes: question.votes,
    };
  });

  for (let i = 0; i < questions.length; i++) {
    let tagIds = questions[i].tagIds;
    let names = [];
    for (let j = 0; j < tagIds.length; j++) {
      let id = tagIds[j];
      let tag = await Tag.find({ _id: id });
      names.push(tag[0].name);
    }
    questions[i].names = names;
  }
  return questions;
};

let get_questions_answered = async function (user) {
  let quest = await Question.find({ _id: { $in: user.questionsAnswered } });
  //console.log(answersFromDB);
  let counter = 1;
  let questions = quest.map(function (question) {
    return {
      qid: "q" + counter++,
      id: question.id,
      title: question.title,
      summary: question.summary,
      text: question.text,
      tagIds: question.tags,
      askedBy: question.asked_by,
      askDate: question.ask_date_time,
      ansIds: question.answers,
      views: question.views,
      votes: question.votes,
    };
  });
  for (let i = 0; i < questions.length; i++) {
    let tagIds = questions[i].tagIds;
    let names = [];
    for (let j = 0; j < tagIds.length; j++) {
      let id = tagIds[j];
      let tag = await Tag.find({ _id: id });
      names.push(tag[0].name);
    }
    questions[i].names = names;
  }
  return questions;
};

module.exports = {
  handleGetUser,
};
