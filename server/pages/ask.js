let Tag = require("../models/tags");
let User = require("../models/users");
let Question = require("../models/questions");
let Answer = require("../models/answers.js");
let Comment = require("../models/comments.js");

let checkTag = async function (req, res, arr) {
  let result = "";

  for (const name of req.nonDuplicate) {
    const existing = await Tag.findOne({ name: name });
    if (!existing) {
      const user = await User.findOne({ username: req.user });
      if (user.reputation < 50) {
        // res.send({ result: "Error", array: [] });
        result = "Error";
        break;
      } else {
        let t = new Tag({
          name: name,
          refUsers: [req.user],
          refCnt: 1,
        });

        await t.save();
        arr.push(t._id);
        // res.send({ result: "Success", array: arr });
      }
    } else {
      existing.refUsers.push(req.user);
      existing.refCnt = existing.refCnt += 1;

      await existing.save();

      // res.send({ array: arr, result: "Success" });
    }
  }

  if (result.length === 0) {
    result = "Success";
    arr = [];
  }

  res.send({ array: arr, result: result });
};

let send_tags = async function (req, res) {
  //console.log("Req " + typeof String(req));

  let arr = [];
  let a = String(req.nonDuplicate).split(",");
  let tagsFromDB = await Tag.find({ name: { $in: a } });
  tagsFromDB.map(function (tag) {
    // arr.push(new ObjectId(tag._id));
    arr.push(tag._id);
    return String(tag._id);
  });

  await checkTag(req, res, arr);

  // res.send({ array: arr, result: "GOOD" });
};

const qCreate = async (req, res) => {
  await questionCreate(req.body, res);
};

let decreaseRefs = async (req, res) => {
  let oldtags = req.body.oldTags;

  for (let i = 0; i < oldtags.length; i++) {
    let tag = await Tag.findOne({ name: oldtags[i] });
    let ind = tag.refUsers.indexOf(req.body.user);
    if (ind > -1) {
      tag.refUsers.splice(ind, 1);
      tag.refCnt = tag.refCnt -= 1;
    }

    await tag.save();
  }
  cleanTags();
  res.send("Done Cleaning");
};

let cleanTags = async () => {
  let tags = await Tag.find();

  for (let i = 0; i < tags.length; i++) {
    if (tags[i].refCnt === 0) await Tag.deleteOne(tags[i]);
  }
};

let deleteUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  let questions = user.questionsAsked;

  let answers = user.questionsAnswered;
  //deleteQuestionAnswers(answers, req.body.username);
  await deleteQuestions(questions);
  await deleteUserComments(req.body.username);
  await deleteUserAnswers(answers);
  //deleteUserAnswerComments(req.body.username);

  await User.deleteOne(user);
  res.send("Deleted User");
};

let deleteUserAnswers = async (username) => {
  let questions = await Question.find();
  let answers = await Answer.find({ ans_by: username });

  //let commentArr = [];
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let answerArr = [];
    for (let j = 0; j < answers.length; j++) {
      if (question.answers.includes(answers[j]._id)) answerArr.push(answers[j]);
    }

    for (let j = 0; j < answerArr.length; j++) {
      let ind = question.answers.indexOf(answerArr[j]._id);
      if (ind > -1) {
        question.answers.splice(ind, 1);
        await question.save();
      }
      await removeAnswerTotal(answerArr[j]);
    }
  }
};

let removeAnswerTotal = async (answer) => {
  let comments = answer.comments;
  for (let i = 0; i < comments.length; i++) {
    let comment = Comment.find({ _id: comments[i] });
    await Comment.deleteOne(comment);
  }
  await Answer.deleteOne(answer);
};

let deleteUserComments = async (username) => {
  await deleteUserCommentsOnQuestion(username);
  await deleteUserCommentsOnAnswer(username);
};

let deleteUserCommentsOnQuestion = async (username) => {
  let questions = await Question.find();
  let user = await User.findOne({ username: username });
  let comments = await Comment.find({ owner: user._id });
  //let commentArr = [];
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let commentArr = [];
    for (let j = 0; j < comments.length; j++) {
      if (question.comments.includes(comments[j]._id))
        commentArr.push(comments[j]);
    }
    for (let j = 0; j < commentArr.length; j++) {
      question.comments.remove(commentArr[j]._id);
      await question.save();
      await Comment.deleteOne(commentArr[j]);
    }
  }
};

let deleteUserCommentsOnAnswer = async (username) => {
  let answers = await Answer.find();
  let user = await User.findOne({ username: username });
  let comments = await Comment.find({ owner: user._id });
  //let commentArr = [];
  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i];
    let commentArr = [];
    for (let j = 0; j < comments.length; j++) {
      if (answer.comments.includes(comments[j]._id))
        commentArr.push(comments[j]);
    }
    for (let j = 0; j < commentArr.length; j++) {
      if (answer.ans_by !== username) {
        answer.comments.remove(commentArr[j]._id);
        await answer.save();
        await Comment.deleteOne(commentArr[j]);
      }
    }
  }
};

let deleteQuestion = async (req, res) => {
  let question = await Question.findOne({ _id: req.body.index });
  await deleteEntireQuestion(question, false);
  res.send("Deleted");
};

let deleteQuestions = async (questions) => {
  for (let i = 0; i < questions.length; i++) {
    let q = await Question.findOne({ _id: questions[i] });
    await deleteEntireQuestion(q, true);
  }
};

let deleteEntireQuestion = async (question, delU) => {
  if (!delU) {
    let user = await User.findOne({ username: question.asked_by });
    if (user) {
      user.questionsAsked.remove(question._id);
      await user.save();
    }
  }
  //console.log(question.text);
  let tags = question.tags;
  let answers = question.answers;

  await derefTags(tags, question.asked_by);
  await cleanTags();
  await deleteComments(question.comments);
  await deleteAnswers(answers, question._id, true, delU);
  await deleteQuestionAnsweredFields(question);
  await Question.deleteOne(question);
};

let deleteQuestionAnsweredFields = async (question) => {
  let users = await User.find();
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (user.questionsAnswered.includes(question._id)) {
      user.questionsAnswered.remove(question._id);
      await user.save();
    }
  }
};

let deleteUserAnswerComments = async (username) => {
  let answer = await Answer.find();
  for (let i = 0; i < answer.length; i++) {
    deleteUserCommentsOnAnswer(answer[i], username);
  }
};

let deleteQuestionAnswers = async (questionAnswers, username) => {
  //Delete all user's answers from questions
  let answers = await Answer.find({ ans_by: username });
  let questions = await Question.find({ _id: { $in: questionAnswers } });
  for (let i = 0; i < questions.length; i++) {
    let questionId = questions[i]._id;
    for (let j = 0; j < answers.length; j++) {
      if (questions[i].answers.includes(answers[j]._id)) {
        await deleteAnswerFromQuestion(questionId, answers[j]._id);
      }
    }
  }
};

let deleteAnswerFromQuestion = async (questionId, answerId, delQ, delU) => {
  //delete a specific answer from a specific question
  // console.log("delete Answer from question");
  if (!delQ && !delU) {
    let question = await Question.findOne({ _id: questionId });
    question.answers.remove(answerId);
    await question.save();
  }
  let answer = await Answer.findOne({ _id: answerId });
  if (!delU) {
    let user = await User.findOne({ username: answer.ans_by });
    if (user) {
      user.questionsAnswered.remove(questionId);
      await user.save();
    }
  }
  let commentArr = answer.comments;
  deleteComments(commentArr);
  await Answer.deleteOne(answer);
};

let derefTags = async (tags, user) => {
  for (let i = 0; i < tags.length; i++) {
    let tag = await Tag.findOne({ _id: tags[i] });
    tag.refUsers.remove(user);
    tag.refCnt = tag.refCnt -= 1;
    await tag.save();
  }
};

let deleteAnswers = async (answers, questionId, delQ, delU) => {
  for (let i = 0; i < answers.length; i++) {
    let answerId = answers[i];
    deleteAnswerFromQuestion(questionId, answerId, delQ, delU);
    /*let answer = await Answer.findOne({ _id: answers[i] });
    let user = await User.findOne({ username: answer.ans_by });
    user.questionsAnswered.remove(questionId);
    await user.save();
    let commentArr = answer.comments;
    await deleteComments(commentArr);
    await Answer.deleteOne(answer);*/
  }
};

let deleteComments = async (comments) => {
  for (let i = 0; i < comments.length; i++) {
    let comment = await Comment.findOne({ _id: comments[i] });
    await Comment.deleteOne(comment);
  }
};
let updateQuestion = async (req, res) => {
  await Question.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        title: req.body.title,
        text: req.body.text,
        summary: req.body.summary,
        tags: req.body.tags,
      },
    }
  );
  res.send("okay");
};

const applyTagRef = async (tags, username) => {
  let user = await User.findOne({ username: username });

  let t = user.tagsRef;
  tags.forEach((tag) => {
    if (!t.includes(tag)) {
      t.push(tag);
    }
  });

  await User.findOneAndUpdate(
    { username: username },
    { $set: { tagsRef: t } },
    { new: true }
  );

  let questions = await Question.find({ asked_by: username });
  // console.log("USERNAME " + username + " questions : " + questions);
  let q = user.questionsAnswered;
  questions.forEach((quest) => {
    if (!q.includes(quest)) {
      q.push(quest);
    }
  });

  await User.findOneAndUpdate(
    { username: username },
    { $set: { questionsAsked: q } },
    { new: true }
  );
};

const questionCreate = async (req, res) => {
  let qdetail = {
    title: req.title,
    text: req.text,
    summary: req.summary,
    tags: req.tags,
    asked_by: req.asked_by,
  };
  if (req.answers != false) qdetail.answers = req.answers;
  if (req.ask_date_time != false) qdetail.ask_date_time = req.ask_date_time;
  qdetail.views = req.views;
  qdetail.votes = req.votes;
  qdetail.comments = req.comments;

  // console.log(qdetail);

  const result = new Question(qdetail);
  await result.save();
  await applyTagRef(req.tags, req.asked_by);
  res.send("OK");
};

module.exports = {
  checkTag,
  send_tags,
  qCreate,
  decreaseRefs,
  updateQuestion,
  deleteQuestion,
  deleteUser,
  deleteEntireQuestion,
};
