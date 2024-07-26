let User = require("../models/users");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const email = req.body.email;
  const epw = req.body.pass;
  const user = (await User.find({ email: email }).exec())[0];
  // console.log("Email:", email);
  // console.log("USER:", user);
  let verdict = 2;
  if (!user) {
    verdict = 0;
  } else {
    let result = await bcrypt.compare(epw, user.passwordHash);
    if (!result) verdict = 1;
  }
  // console.log("VERDICT:", verdict);

  if (verdict !== 0 && verdict !== 1) {
    //const token = generateToken(user);

    // res.cookie("token", token, {
    //   maxAge: 3600000,
    //   httpOnly: false,
    //   secure: true,
    //   sameSite: "lax",
    // });
    /* session.email = user.email;
    session.username = user.username;*/
    req.session.username = user.username;
    req.session.save(() => {
      res.send({ username: user.username, result: 2 });
    });

    //res.json({ result: 2, user: user.username });
  } else {
    return res.send({ result: verdict, username: "" });
  }
}

async function checkLogIn(req, res) {
  /*let username = "";
  if (session.username) username = session.username;
  res.send(username);*/
  if (req.session && req.session.username) {
    res.send({ logIn: true, username: req.session.username });
  } else res.send({ logIn: false, username: "" });
}

async function logout(req, res) {
  /*session.email = null;
  session.username = null;
  res.send("logged out");*/
  req.session.destroy(() => {
    res.send("Logged Out");
  });
}

module.exports = {
  login,
  logout,
  checkLogIn,
};
