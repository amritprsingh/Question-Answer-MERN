let Question = require("../models/questions");
let Answer = require("../models/answers");
let User = require("../models/users");

let postA = async function (ans) {
  let posterUsername = ans.ans_by;
  let user = await User.findOne({ username: posterUsername });
  if (user.reputation < 50) {
    return -1;
  }

  let answer = {
    text: ans.text,
    ans_by: ans.ans_by,
  };

  let a = new Answer(answer);
  await a.save();
  return a;
};

const postAnswer = async function (req, res) {
  let id = await postA(req);
  if (id === -1) {
    res.send("NOT OKAY");
    return;
  }

  const updateAnswers = {
    $push: {
      answers: id._id,
    },
  };

  await Question.updateOne({ _id: req.qid }, updateAnswers);
  let user = await User.findOne({ username: req.ans_by });

  if (user.questionsAnswered.indexOf(req.qid) === -1) {
    user.questionsAnswered.push(req.qid);
    await user.save();
  }

  res.send("OKAY");

  //let q = await Question.findOne({ _id: req.indString });
};

module.exports = {
  postAnswer,
};
