const express = require('express');
const path = require('path')
const passport = require('passport')
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const authRouter = require('./routes/auth.routes');
const goalsRouter = require('./routes/goals.routes');
const overviewRouter = require('./routes/overview.routes');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();

const corsOptions = {
  origin: ["http://localhost:3000", "https://achieve-frontend-2022.vercel.app"],
  Credential: true,
};

app.set('port', process.env.PORT || 8080);

sequelize.sync({ force: false })
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/goals', goalsRouter);
app.use('/overview', overviewRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} router not found.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}.`);
});
