let Question = require("../models/questions");

let Answer = require("../models/answers");
let Comment = require("../models/comments");
let User = require("../models/users");

let handleComment = async (req, res) => {
  let oid = req.body.id;
  let username = req.body.username;
  let value = req.body.value;

  let obj = await determineDocumentType(oid);

  if (obj === -1) {
    res.send("NOT OKAY");
    return;
  }

  let comment = await commentCreate(username, value);

  if (comment === -1) {
    res.send("TRY AGAIN");
    return;
  } else if (comment === -2) {
    res.send("USER REPUTATION");
    return;
  } else if (comment === -3) {
    res.send("COMMENT LENGTH");
    return;
  }

  obj.comments.push(comment._id);
  await obj.save();
  res.send("OKAY");
};

let determineDocumentType = async (id) => {
  let question = await Question.findOne({ _id: id });
  if (question !== null) {
    return question;
  }

  let answer = await Answer.findOne({ _id: id });
  if (answer !== null) {
    return answer;
  }

  return -1;
};

let commentCreate = async (username, value) => {
  let user = await User.findOne({ username: username });
  if (user === undefined) {
    return -1;
  } else if (user.reputation < 50) {
    return -2;
  } else if (value.length > 140) {
    return -3;
  }

  // console.log(user);
  const comment = new Comment({ comment: value, owner: user._id });
  await comment.save();
  return comment;
};

let getCommentsFromId = async (res, id) => {
  let obj = await determineDocumentType(id);
  // console.log(id);
  // console.log(obj);
  let msg = "";
  let comments = [];
  if (obj === -1) {
    msg = "NOT OKAY";
  } else {
    msg = "OKAY";
    let commentIds = obj.comments;
    // console.log(commentIds);

    for (let i = 0; i < commentIds.length; i++) {
      let comment = await Comment.findOne({ _id: commentIds[i] });
      if (comment !== undefined) {
        let user = await User.findOne({ _id: comment.owner });
        comments.push({
          cid: comment._id,
          comment: comment.comment,
          username: user.username,
          date_posted: comment.date_posted,
          votes: comment.votes,
        });
      }
    }
  }

  res.json({ msg: msg, comments: comments });
};

module.exports = { handleComment, getCommentsFromId };
