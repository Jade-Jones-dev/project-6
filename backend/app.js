
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

const userRoutes = require('./routes/user');


const app = express();

mongoose.connect('mongodb+srv://jade:firstone@cluster0.gtwrqo6.mongodb.net/test')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  
app.use(express.json());

app.use('/api/auth', userRoutes);

module.exports = app;

