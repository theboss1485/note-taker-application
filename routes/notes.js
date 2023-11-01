

/* I used code in this file that was from activity 21 of Module 11, such as the syntax of the GET route, the syntax for the start of the POST route, and 
a couple of the 'require' statements at the beginning.*/

const fs = require('fs');
const notes = require('express').Router()
const path = require('path');

// I took the code for using the uuid package from https://dev.to/gulshanaggarwal/npm-packages-to-generate-unique-ids-for-your-next-project-1p3b

const {v4: uuidv4} = require('uuid')

const writeToFile = require('../helpers/write-to-file.js')

//This GET route helps to get the notes from the notes.json file so they can be displayed on the page. 
notes.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "../db/notes.json"));
});

//This POST route saves the notes the user enters into the notes.json file.
notes.post('/', (req, res) => {

    let postedData = req.body;
    let currentDataArray = null;

    /* To save a new note, first I get the currently saved notes out of the notes.json file.  Then, 
    I add the new note to them, and then I write all the notes back to the notes.json file.*/
    fs.readFile('./db/notes.json', 'utf8', function(error, data){

        if(error){

            console.log(error.message)
        }

        if(data === undefined || data === null){
            
            currentDataArray = [];

        } else {
            
            currentDataArray = JSON.parse(data);
        }

        postedData.id = uuidv4();

        currentDataArray.push(postedData);

        writeToFile(currentDataArray);
    });

    /* I am aware that the module 11 challenge instructions said the the POST request needed to return 
    the note to the client.  As such, the server sends the note back to the client-side code below.  However, because the 
    client-side already had methods implemented via the starter code that would display the notes to the user, and the challenge
    instrinctions said that the application's front-end has already been created, I decided not to touch these methods.  
    Therefore, the client-side code doesn't actually do anything with this response.   */
    res.json({postedData});
});

// This DELETE route deletes the note that the user chooses from the notes.json file.
notes.delete('/:id',(req, res) => {

    res.send("Response sent!!");

    /* To delete a note, I read the notes.json file.  Then, I filter out the note
    to be deleted and rewrite all the remaining notes back to the notes.json file. */
    fs.readFile('./db/notes.json', 'utf8', function(error, data){

        if(error){

            console.log(error);

        } else {

            let noteArray = JSON.parse(data);

            truncatedNoteArray = noteArray.filter(note => note.id !== req.params.id);

            for(let counter = 0; counter < truncatedNoteArray.length; counter++){

                truncatedNoteArray[counter].id = uuidv4();
            }

            writeToFile(truncatedNoteArray);
        }
    });
});

module.exports = notes