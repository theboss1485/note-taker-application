const fs = require('fs');

const express = require('express');
const path = require('path');
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static("public"));

// Here is the GET route for the root, which displays the landing page.
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));
});

//Here is the GET route for '/notes', which displays the notes page.
app.get("/notes", (req, res) => {

    res.sendFile(path.join(__dirname, "public/notes.html"));
});

//This GET route helps to get the notes from the notes.json file so they can be displayed on the page. 
app.get("/api/notes", (req, res) => {

    res.sendFile(path.join(__dirname, "./db/notes.json"));
});

//This POST route saves the notes the user enters into the notes.json file.
app.post('/api/notes', (req, res) => {

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
app.delete('/api/notes/:id',(req, res) => {

    res.send("Response sent!!");

    /* To delete a note, I pull read the notes.json file.  Then, I filter out the note
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

            console.log("Read successful");

            writeToFile(truncatedNoteArray);
        }
    });
});


// This function makes the application listen on the specified port for various requests.
app.listen(PORT, () => {

    console.log(`Note Taker Application listening at http://localhost:${PORT}`)
});


// This function writes the saved notes to the notes.json file.
function writeToFile(noteArray){

    fs.writeFile('./db/notes.json', JSON.stringify(noteArray, null, 2), function(error){
       
        if(error){

            console.log(error);
        
        }
    });
}