let User = require("../models/users");

let getAllUsers = async (req, res) => {
  let users = await User.find();
  res.send(users);
};

module.exports = {
  getAllUsers,
};
