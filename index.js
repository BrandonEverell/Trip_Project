const Express = require("express");
const path = require('path');
const morgan = require('morgan');
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const session = require('express-session')
const methodOverride = require('method-override');
const flash = require('flash');
const KnexSessionStore = require('connect-session-knex')(session)
const kx = require('./db/connection')
const moment = require('moment');
require('./services/passport');

const welcome = require('./routes/welcome');
//ROUTES
const root = require('./routes')
const authRoutes = require('./routes/authRoutes');

// const userRoutes = require('./routes/userRoutes');



// const root = require('./routes');
//init app
const app = Express();

// view engine
app.set('view engine', 'ejs')
app.use(Express.static(path.join(__dirname, 'public')))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(morgan('dev'))
 app.use(methodOverride('_method'))
app.use(session({
  name: '_trip',
  secret: 'supersecret', // key used to encrypt session
  cookie: {
     maxAge: 1000 * 60 * 60 * 24  // A day (in milliseconds)
  },
  resave: true,
  saveUninitialized: false,
  store: new KnexSessionStore({knex: kx})
}))
// Connect flas
app.use(flash())
// app.use(function (req,res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
// });
app.use(async function setCurrentUser (req, res, next) {
  const {userId} = req.session

let user
req.currentUser = false
res.locals.currentUser = false

if (userId) {
  user = await kx.first().from('users').where({id: userId})
  req.currentUser = user
  res.locals.currentUser = user
}
next()
});




app.use(passport.initialize());
app.use(passport.session());



app.use(root);
app.use(welcome);
app.use(authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
