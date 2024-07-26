const bcrypt = require("bcrypt");
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid mongodb URL as the first argument"
  );
  return 0;
} else if (userArgs.length != 3) {
  console.log("ERROR: Invalid Number of Arguments");
  return 0;
}

let User = require("./models/users");

let mongoose = require("mongoose");
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const createAdmin = async () => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const pwHash = await bcrypt.hash(userArgs[2], salt);
  const newUser = new User({
    name: "Admin Account",
    username: "admin",
    email: userArgs[1],
    passwordHash: pwHash,
    userType: "Admin",
    reputation: 1000,
    questionsAsked: [],
    questionsAnswered: [],
    tagsRef: [],
  });
  const savedUser = await newUser.save();
  console.log(newUser);
  console.log(savedUser);
};

const populate = async () => {
  await createAdmin();
  if (db) db.close();
  console.log("done");
};

populate().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
