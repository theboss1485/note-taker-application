const fs = require('fs');

const express = require('express');
const path = require('path');
const PORT = 3001;

const app = express();

// Parsing the Incoming body object (req.body)
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static("public"));

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {

    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {

    res.sendFile(path.join(__dirname, "./db/notes.json"));
});

app.post('/api/notes', (req, res) => {

    console.log(req.body);
    console.log(typeof req.body);

    let postedData = req.body;

    // we want to READ the info (DATA) in where we need it 
    fs.readFile('./db/notes.json', 'utf8', function(error, data){

        if(error){

            console.log(error.message)
        }

        if(data === undefined || data === null){
            
            currentDataArray = [];

        } else {
            
            let currentDataObject = JSON.parse(data);
            currentDataArray = currentDataObject;
        }
        
        
        console.log(currentDataArray);

        currentDataArray.push(postedData);
        console.log(currentDataArray);

        // We MODIFTY (UPDATE) our original data(set)


        // WE need to SAVE the NEW DATASET 

        writeToFile(currentDataArray);
    });

    

    res.json({ msg: "Note Saved"});
});

app.delete('/api/notes/:id',(req, res) => {

    console.log("deletion call");

    res.send("Response sent!!");

    fs.readFile('./db/notes.json', 'utf8', function(error, data){

        console.log("read call");

        let noteArray = JSON.parse(data);

        console.log(noteArray);

        truncatedNoteArray = noteArray.filter(note => note.id !== req.params.id);

        console.log(req.params.id);

        console.log(truncatedNoteArray);

        for(let counter = 0; counter < truncatedNoteArray.length; counter++){

            truncatedNoteArray[counter].id = "note-" +  (counter + 1);
        }

        writeToFile(truncatedNoteArray);
    });
});



app.listen(PORT, () => {

    console.log(`Note Taker Application listening at http://localhost:${PORT}`)
});

function writeToFile(noteArray){

    fs.writeFileSync('./db/notes.json', JSON.stringify(noteArray, null, 2), function(error){
       
        if(error){

            console.log(error.message);
        
        } else{

            console.log("Note saved successfully.");
        }
        });
}