let Question = require("../models/questions");
let Tag = require("../models/tags");
let Answer = require("../models/answers");

let get_questions = async function () {
  let questionsFromDB = await Question.find({});
  let counter = 1;
  let questions = questionsFromDB.map(function (question) {
    return {
      qid: "q" + counter++,
      id: question.id,
      title: question.title,
      text: question.text,
      tagIds: question.tags,
      askedBy: question.asked_by,
      askDate: question.ask_date_time,
      ansIds: question.answers,
      views: question.views,
      votes: question.votes
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

let get_answer = async function (id) {
  let answerFromDB = await Answer.find({ _id: id });
  let answer = answerFromDB.map(function (ans) {
    return {
      aid: ans.id,
      text: ans.text,
      ansBy: ans.ans_by,
      ansDate: ans.ans_date_time,
    };
  });

  return answer;
};

let newest_questions = async function (res) {
  let questions = await get_questions();

  let updatedQuestions = [];
  for (let i = questions.length - 1; i >= 0; i--) {
    updatedQuestions.push(questions[i]);
  }

  res.send(updatedQuestions);
};

let active_questions = async function (res) {
  let questions = await get_questions();
  let activeQs = [];
  let unansQs = [];

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].ansIds.length === 0) {
      unansQs.push(questions[i]);
    } else {
      activeQs.push(questions[i]);
    }
  }

  //get most recent answer of each question
  let answers = [];
  for (let i = 0; i < activeQs.length; i++) {
    let ans = await get_answer(
      activeQs[i].ansIds[activeQs[i].ansIds.length - 1]
    );
    answers.push(ans[0]);
  }

  //sort as most recent answers first
  answers.sort((a1, a2) => {
    let a1Date = a1.ansDate;
    let a2Date = a2.ansDate;
    return a2Date - a1Date;
  });

  //now, sort questions based on their answers' index where all answers are sorted
  let updatedQuestions = []; //unique answer/question mapping so this is possible
  for (let i = 0; i < answers.length; i++) {
    for (let j = 0; j < questions.length; j++) {
      let aid = answers[i].aid;
      let qaid = questions[j].ansIds[questions[j].ansIds.length - 1];
      // console.log("Aid: " + aid + ",\nQaid: " + qaid);
      if (aid == qaid) {
        updatedQuestions.push(questions[j]);
        break;
      }
    }
  }

  //sort to be most recent questions first
  unansQs.sort((q1, q2) => {
    return q2.qid.slice(1) - q1.qid.slice(1);
  });

  for (let i = 0; i < unansQs.length; i++) {
    updatedQuestions.push(unansQs[i]);
  }

  res.send(updatedQuestions);
};

let unanswered_questions = async function (res) {
  let questions = await get_questions();
  let updatedQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].ansIds.length === 0) {
      updatedQuestions.push(questions[i]);
    }
  }

  if (updatedQuestions.length > 0) {
    updatedQuestions.sort((q1, q2) => {
      return q2.qid.slice(1) - q1.qid.slice(1);
    });
  }

  res.send(updatedQuestions);
};

module.exports = {
  newest_questions,
  active_questions,
  unanswered_questions,
  get_answer
};
