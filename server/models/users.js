var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, maxLen: 50 },
    username: { type: String, required: true, maxLen: 50 },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    userType: { type: String, required: true },
    reputation: { type: Number, required: true },
    dateRegistered: { type: Date, default: Date.now },
    questionsAsked: [{ type: Schema.Types.ObjectId, ref: "Questions", required: true }],
    questionsAnswered: [{ type: Schema.Types.ObjectId, ref: "Questions" }],
    tagsRef: [{ type: Schema.Types.ObjectId, ref: "Tags", required: true }],
    votedOn: [{type: Schema.Types.ObjectId, refPath: 'type'}],
    type: {type: String, enum: ['Questions', 'Answers', 'Tags']}
  },
  { timestamps: true }
);

UserSchema.virtual("url").get(function () {
  return "posts/users/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);
