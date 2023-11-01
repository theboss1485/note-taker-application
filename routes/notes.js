/* I used code in this file that was from activity 21 of Module 11, such as the syntax of the GET route, the syntax for the start of the POST route, and 
a couple of the 'require' statements at the beginning.*/

const fs = require('fs');
const notes = require('express').Router()
const path = require('path');

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

        postedData.id = "note-" + (currentDataArray.length + 1);

        currentDataArray.push(postedData);

        writeToFile(currentDataArray);
    });

    res.json({ msg: "Note Saved"});
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

                truncatedNoteArray[counter].id = "note-" +  (counter + 1);
            }

            writeToFile(truncatedNoteArray);
        }
    });
});

module.exports = notes