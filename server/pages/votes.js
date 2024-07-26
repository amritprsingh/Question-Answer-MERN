let Question = require("../models/questions");
let Answer = require("../models/answers");
let Comment = require("../models/comments");
let User = require("../models/users");

// let getVotes = async (oid, res) => {
//     let obj = await determineType(data.oid, data.inc);
//     res.json({ cmt: "GET VOTES", votes: obj.votes });
// }

let updateVotes = async (req, res) => {
  let data = {
    oid: req.body.oid,
    inc: req.body.inc,
    votes: req.body.votes,
    username: req.body.username,
  };

  let votes = data.votes;
  let obj = await determineType(data.oid, data.inc, data.username);

  // console.log(obj);
  let cmt = "";
  if (obj === -3 && data.inc !== 0) {
    // console.log("A");
    cmt = "Reputation problem";
    // return;
  } else if (obj === -2 || obj === -1) {
    // console.log("B");
    cmt = "Can't downvote comment";
    // return;
  } else {
    // console.log("C");
    obj.votes += data.inc;
    await obj.save();
    votes = obj.votes;
  }

  // obj.votes += data.inc;
  // await obj.save();
  // res.send("OKAY");
  res.json({ votes: votes, cmt: cmt });
};

let determineObjectType = async (id) => {
  let question = await Question.findOne({ _id: id });
  if (question !== null) {
    return question;
  }

  let answer = await Answer.findOne({ _id: id });
  if (answer !== null) {
    return answer;
  }

  let comment = await Comment.findOne({ _id: id });
  if (comment !== null) {
    return comment;
  }

  return -1;
};

let determineType = async (id, inc, voterUsername) => {
  let voter = await User.findOne({ username: voterUsername });
  let diff = 0;
  let question = await Question.findOne({ _id: id });
  if (question !== null) {
    let user = await User.findOne({ username: question.asked_by });
    // votes = question.votes;
    if (voter.reputation < 50 && inc !== 0) return -3;
    if (inc > 0) diff = 5;
    else if (inc < 0) diff = -10;
    user.reputation += diff;
    // console.log("QUESTION FOUND");
    await user.save();
    return question;
  }

  let answer = await Answer.findOne({ _id: id });
  if (answer !== null) {
    let user = await User.findOne({ username: answer.ans_by });
    // votes = answer.votes;
    if (voter.reputation < 50 && inc !== 0) return -3;
    if (inc > 0) diff = 5;
    else if (inc < 0) diff = -10;

    // console.log("ANSWER FOUND");
    user.reputation += diff;
    await user.save();
    return answer;
  }

  let comment = await Comment.findOne({ _id: id });
  if (comment !== null) {
    //let user = await User.findOne({ _id: comment.owner });
    // votes = comment.votes;
    if (voter.reputation < 50 && inc !== 0) return -3;
    if (inc < 0) return -2;
    // console.log("COMMENT FOUND");
    return comment;
  }

  return -1;
};

module.exports = { updateVotes };
