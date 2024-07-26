let User = require("../models/users");
const bcrypt = require("bcrypt");

async function register_user(req, res) {
    let saltRounds = 10;
    // console.log("NAME:", req.body.userName);
    const salt = await bcrypt.genSalt(saltRounds);
    const uid = req.body.userName;
    const first = req.body.first;
    const last = req.body.last;
    const pwHash = await bcrypt.hash(req.body.pass, salt);
    const name = first + " " + last;
    const email = req.body.email;
    const newUser = new User({
      name: name,
      username: uid,
      email: email,
      passwordHash: pwHash,
      userType: "User",
      reputation: 50,
      questionsAsked: [],
      questionsAnswered: [],
      tagsCreated: [],
    });

    const savedUser = await newUser.save();
    // console.log(savedUser);
    res.send(savedUser);
}

async function register_email(req, res) {
    const em = req.body.email;
    const user = (await User.find({ email: em }).exec())[0];
    let emailExist = 0;
    if (user) emailExist = 1;
    res.send({ result: emailExist });
}

module.exports = { register_user, register_email };