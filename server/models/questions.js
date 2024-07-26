// Question Document Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  title: { type: String, required: true, maxLength: 50 },
  summary: { type: String, required: true, maxLength: 140 },
  text: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  asked_by: { type: String, required: true },
  ask_date_time: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
});

QuestionSchema.virtual("url").get(function () {
  return "/posts/question/" + this._id;
});

module.exports = mongoose.model("Question", QuestionSchema);
