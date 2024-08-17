const express = require('express');
const cors = require('cors');
const mongoose = require ("mongoose");

const app = express();
const contactsRouter = require('./routes/api/contacts.js');
const usersRouter =  require("./routes/api/users.js");
const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config()
const logger = require('morgan');

const host = "mongodb+srv://florivachente:Pr0gr1m1t01r3@clusterflorentinavachen.wvt36rz.mongodb.net/";

mongoose.connect(host, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("DB connected successful."))
    .catch(  err => {console.log("Couldn't connect to DB", err);
                     process.exit(1)})


const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(logger(formatsLogger));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
require("./config/passport.js")(passport);
app.use(passport.initialize());

app.use('/api/contacts', contactsRouter);
app.use('/api', usersRouter);


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: "error",
    code: err.status || 500,
    message: err.message,
    data: err.data || "Internal Server Erroriiiii",
  });
});

module.exports = app;
