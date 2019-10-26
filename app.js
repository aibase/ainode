const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer'); // module for file upload/download

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

// Configure Multer for file upload/download; cb - call back function
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});
// Config multer file type Filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/files/images', express.static(path.join(__dirname, 'files/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes); // registering the router for feed
app.use('/auth', authRoutes); // registering the router for auth

// registering the error handler for the REST app
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; // if undefined assign 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(
  'mongodb+srv://steve_ai91:o82HN0KCxu6dtS5w@cluster0-n7ze3.mongodb.net/ainode?retryWrites=true',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
).then(result => {
  app.listen(8081);
}).catch(err => console.log(err));