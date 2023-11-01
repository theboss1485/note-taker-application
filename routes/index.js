/* Activity 21 for Module 11 called this file index.js while leaving a client-side script
called index.js in the 'public' folder.  As such, I have done the same here.  This file is 
an intermediary between server.js and the notes.js route file.  If there were other routes for
this application, they would be used in this file with app.use(). 

This code is basically taken from the route/index.js file of activity 21 for module 11.  I wouldn't 
have known how to write it differently other than changing variable names.*/

const express = require('express');

const notesRouter = require('./notes');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;