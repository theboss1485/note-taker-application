/* Most of the code in this file is either boilerplate that was in activity 21 of Module 11, or else it is 
code for routes that looks a lot like the code in server.js for activity 21 of Module 11.  I really wouldn't have
known how to write this code differently other than changing the order of lines of code and changing variable names.*/

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;

const api = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'));

app.use('/api', api);

app.get("/notes", (req, res) => {

    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Here is the GET route for '/notes', which displays the notes page.


// This function makes the application listen on the specified port for various requests.
app.listen(PORT, () => {

    console.log(`Note Taker Application listening at http://localhost:${PORT}`)
});


