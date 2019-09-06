const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const connectSessionKnex = require('connect-session-knex')

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const db = require('../database/dbConfig')

const server = express();
const KnexSessionStore = connectSessionKnex(session)

const sessionConfig = {
  name: "notsession", // default is connect.sid
  // This should not be hardcoded. This should be in an env variable
  secret: "monsoon demons stole my teacher",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    secure: false // set to TRUE in production -- only set cookies over https. Server will not send back a cookie over http.
  }, 
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  // Where do we store our sessions? defaults to server
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60 * 24 * 1
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
