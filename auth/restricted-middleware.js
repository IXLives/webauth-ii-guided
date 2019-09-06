const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

module.exports = (req, res, next) => {
  //if there is a session && if that session has a user
  console.log('req session', req.session)
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
};
