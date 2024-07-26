let Tag = require("../models/tags");
let Question = require("../models/questions");

let get_tags = async (res) => {
  let tagsFromDB = await Tag.find({});
  res.send(tagsFromDB);
};

let get_tags_profile = async (req, res) => {
  let tags = await Tag.find({});

  let retTags = [];
  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i];

    if (tag.refUsers.includes(req.body.username)) retTags.push(tag);
  }
  res.send(retTags);
};

let deleteTag = async (req, res) => {
  let tag = await Tag.findOne({ name: req.body.name });
  let questions = await Question.find();
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    if (question.tags.includes(tag._id)) {
      let ind = question.tags.indexOf(tag._id);
      if (ind > -1) {
        question.tags.splice(ind, 1);
        await question.save();
      }
    }
  }
  await Tag.deleteOne(tag);
  res.send("deleted tag");
};

let updateTag = async (req, res) => {
  await Tag.findOneAndUpdate(
    { name: req.body.oldTag },
    { $set: { name: req.body.newTag } }
  );
  res.send("tag updated");
};

module.exports = {
  get_tags,
  get_tags_profile,
  deleteTag,
  updateTag,
};
