// This function writes the saved notes to the notes.json file.
const fs = require('fs');

function writeToFile(noteArray){

    fs.writeFile('./db/notes.json', JSON.stringify(noteArray, null, 2), function(error){
       
        if(error){

            console.log(error);
        }
    });
}

module.exports = writeToFile;