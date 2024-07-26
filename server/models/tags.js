// Tag Document Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: { type: String, required: true, maxLen: 20 },
  refUsers: [{ type: String }],
  refCnt: { type: Number, default: 1 },
});

TagSchema.virtual("url").get(function () {
  return "posts/tag/" + this._id;
});

module.exports = mongoose.model("Tag", TagSchema);
