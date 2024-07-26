const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const db_adr = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(db_adr);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", function () {
  console.log("Connected to database.");
});

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const oneHour = 1000 * 60 * 60;
app.use(
  session({
    secret: "supersecret difficult to guess string",
    cookie: { secure: false, maxAge: oneHour },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/fake_so",
    }),
  })
);

//set up server to listen
const port = 8000;
const server = app.listen(port, () => {
  console.log("Server started.");
});

const { register_user, register_email } = require("./pages/signup");
app.post("/register_email", async (req, res) => {
  await register_email(req, res);
});

app.post("/register", async (req, res) => {
  await register_user(req, res);
});

const { login, checkLogIn, logout } = require("./pages/login");
app.post("/login", async (req, res) => {
  //login(req, res, session);
  await login(req, res);
});

app.get("/checkLoggedIn", async (req, res) => {
  //checkLogIn(req, res, session);
  await checkLogIn(req, res);
});

app.get("/logout", async (req, res) => {
  //logout(req, res, session);
  await logout(req, res);
});

const {
  newest_questions,
  active_questions,
  unanswered_questions,
} = require("./pages/home");
//get questions based on newest sorting
app.get("/home/newest/", async (req, res) => {
  await newest_questions(res);
});

//get questions based on active sorting
app.get("/home/active/", async (req, res) => {
  await active_questions(res);
});

//get questions based on unanswered sorting
app.get("/home/unanswered/", async (req, res) => {
  await unanswered_questions(res);
});

const {
  qCreate,
  send_tags,
  updateQuestion,
  decreaseRefs,
  deleteQuestion,
  deleteUser,
} = require("./pages/ask");
app.post("/ask/tags", async (req, res) => {
  //checkTag(req.body, res);
  // console.log("ask question");
  await send_tags(req.body, res);
});

app.post("/deleteQuestion", async (req, res) => {
  await deleteQuestion(req, res);
});

app.post("/deleteUser", async (req, res) => {
  await deleteUser(req, res);
});

app.post("/ask", async (req, res) => {
  await qCreate(req, res);
  //res.send("Added Question");
});

app.post("/cleanTags", async (req, res) => {
  await decreaseRefs(req, res);
});

app.post("/updateQuestion", async (req, res) => {
  await updateQuestion(req, res);
});

const { postAnswer } = require("./pages/post");
app.post("/post", async (req, res) => {
  // console.log("post here");
  await postAnswer(req.body, res);
});

//search page
const search = require("./pages/search");
app.get("/search/newest/:phrase", async (req, res) => {
  const phrase = req.params["phrase"];
  await search(phrase, res, 0);
});

app.get("/search/active/:phrase", async (req, res) => {
  const phrase = req.params["phrase"];
  await search(phrase, res, 1);
});

app.get("/search/unanswered/:phrase", async (req, res) => {
  const phrase = req.params["phrase"];
  await search(phrase, res, 2);
});

const { getAllUsers } = require("./pages/users");
app.get("/allUsers", async (req, res) => {
  await getAllUsers(req, res);
});

//tags page
const {
  get_tags,
  get_tags_profile,
  deleteTag,
  updateTag,
} = require("./pages/tags");
app.get("/tags", async (req, res) => {
  //console.log("Tags seen");
  await get_tags(res);
});

app.post("/tagsProfile", async (req, res) => {
  await get_tags_profile(req, res);
});

app.post("/deleteTag", async (req, res) => {
  await deleteTag(req, res);
});

app.post("/updateTag", async (req, res) => {
  await updateTag(req, res);
});

const {
  updateView,
  getAnswer,
  getQuestion,
  getComments,
} = require("./pages/view");
app.post("/view", async (req, res) => {
  await updateView(req);
  await getQuestion(req, res);
});

app.post("/answer", async (req, res) => {
  await getAnswer(req, res);
});

const { handleComment } = require("./pages/comments");
app.post("/comment/post", async (req, res) => {
  await handleComment(req, res);
});

app.get("/answer/comments", async (req, res) => {
  // console.log(req.body);
  const { comments } = req.query;
  let resComments = await getComments(JSON.parse(comments));
  res.json(resComments);
  // console.log(comments);
  // res.send("OKAY");
});

const { handleGetUser } = require("./pages/profile");
app.post("/getUser", async (req, res) => {
  await handleGetUser(req, res);
});

const { updateVotes } = require("./pages/votes");
app.post("/vote", async (req, res) => {
  await updateVotes(req, res);
});

const { getCommentsFromId } = require("./pages/comments");
app.get("/comments/get/:id", async (req, res) => {
  await getCommentsFromId(res, req.params["id"]);
});

// app.get("/vote", async (req, res) => {
//   const { oid } = req.query;
//   await getVotes(oid, res);
// });

process.on("SIGINT", () => {
  if (db) {
    db.close()
      .then((result) => console.log("Database instance disconnected."))
      .catch((err) => console.log(err));
  }

  server.close(() => {
    console.log("Server terminated");
    process.exit(0);
  });
});
