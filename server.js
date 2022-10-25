/* global require, process */ //this prevents eslint from marking these undefined vars as errors

require('dotenv').config(); //load all environment variables from the .env file

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

/*
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }); //see '.env' file for corresponding DATABASE_URL
const db = mongoose.connection;
db.on('error', (error) => console.error(error)); //if there is an error connecting to my db, log the error
db.once('open', () => console.log('connected to database, yay!')); //if I successfully connect, log this message (will only run once)
*/
app.use(express.json()) //this allows the server to accept JSON as a BODY (instead of a POST element or a GET element, etc)
//Setting up the routes
const usersRouter = require('./routes/users'); //since all routes will stem from the root url + '/users', this lets me shorthand it so in my routes (in users.js) I don't have to specify '/users' for each one.
app.use('/users', usersRouter);

app.listen(port, () => console.log(`server is running on port: ${port}`));