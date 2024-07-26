// Comment Document Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: { type: String, required: true, maxLength: 100 },
  votes: { type: Number, default: 0},
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  date_posted: { type: Date, default: Date.now }
});

CommentSchema.virtual("url").get(function () {
  return "/posts/comment/" + this._id;
});

module.exports = mongoose.model("Comment", CommentSchema);
