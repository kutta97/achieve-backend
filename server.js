const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();
const { sequelize } = require('./models');

const app = express();

const corsOptions = {
  origin: "http://localhost:8080"
};

app.set('port', process.env.PORT || 8080);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize.sync({ force: true })
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} router not found.`);
  error.status = 404;
  next(error);
});

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}.`);
});
