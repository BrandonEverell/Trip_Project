const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const session = require('express-session')
const kx = require('./db/connection')
require('./services/passport');



const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(session({
  name: '_trip',
  secret: 'supersecret', // key used to encrypt session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // A day (in milliseconds)
  },
  resave: true,
  saveUninitialized: false,

}))

app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app);

// NEEDED:





const PORT = process.env.PORT || 5000;
app.listen(PORT);
