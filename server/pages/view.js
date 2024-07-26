let Question = require("../models/questions");
let Answer = require("../models/answers");
let Tag = require("../models/tags");
let Comment = require("../models/comments");
let User = require("../models/users");
let updateView = async function (req) {
  if(!req.body.rerender) return;
  await Question.updateOne({ _id: req.body.indString }, { $inc: { views: 1 } });
};

let getQuestion = async function (req, res) {
  let q = await Question.findOne({ _id: req.body.indString });
  let ans = await getAnswers(q.answers);
  let tags = await getTags(q.tags);
  let comments = await getComments(q.comments);
  // let user = await Question.findOne({ usersVoted: req.body.uid });
  // let voted = (user === undefined)? false: true;

  //q.ans = ans;
  let dat = {
    questions: q,
    answers: ans,
    // alreadyVoted: voted,
    tagNames: tags,
    comments: comments
  };

  res.send(dat);
};

/*let getAnswer = async function (req, res) {
  let a = await Answer.findOne({ _id: req.body.indString });
  res.send(a);
};*/

let getTags = async function(tagIds) {
  let tagNames = [];
  for(let i=0; i<tagIds.length; i++) {
    let tag = await Tag.findOne({ _id: tagIds[i] });
    tagNames.push(tag.name);
  }

  return tagNames;
}

let getComments = async function(commentIds) {
  let comments = [];
  for(let i=0; i<commentIds.length; i++) {
    let comment = await Comment.findOne({ _id: commentIds[i] });
    if(comment !== undefined) {
      let user = await User.findOne({ _id: comment.owner });
      comments.push({
        cid: comment._id,
        comment: comment.comment,
        username: user.username,
        date_posted: comment.date_posted,
        votes: comment.votes
      });
    }
  }

  // console.log("Comments:");
  // console.log(comments);
  // console.log("________");

  return comments;
}

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

let getAnswers = async function (id) {
  //let ans = [];
  /*for (let i = 0; i < id.length; i++) {
    let a = await Answer.find({ _id: id[i] });
    ans.push(a);
  }*/
  let a = await Answer.find({ _id: id });
  //ans.push(a);
  return a;
};

module.exports = {
  updateView,
  getQuestion,
  get_answer,
  getAnswers,
  getComments
};
