const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/files/images', express.static(path.join(__dirname, 'files/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes); // registering the router for feed

// registering the error handler for the REST app
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; // if undefined assign 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose.connect(
  'mongodb+srv://steve_ai91:o82HN0KCxu6dtS5w@cluster0-n7ze3.mongodb.net/ainode?retryWrites=true',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
).then(result => {
  app.listen(8081);
}).catch(err => console.log(err));