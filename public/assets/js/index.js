let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {

    noteForm = document.querySelector('.note-form');
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    clearBtn = document.querySelector('.clear-btn');
    noteList = document.querySelectorAll('.list-container .list-group');
}

// This function displays an element when it was previously hidden.
const show = (elem) => {

    elem.style.display = 'inline';
};

// This function hides an element.
const hide = (elem) => {

    elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

/* getNotes() uses a GET fetch call to grab the notes from the notes.json file. */
const getNotes = () =>

    fetch('/api/notes', {

        method: 'GET',
        headers: {

            'Content-Type': 'application/json'
        }
    });

/* saveNote() uses a POST fetch call to send a new note to the server, which then writes
it to the notes.json file. */
const saveNote = (note) =>

    fetch('/api/notes', {

        method: 'POST',
        headers: {

            'Content-Type': 'application/json'
        },

        body: JSON.stringify(note)
    });

/* deleteNote() uses a DELETE fetch call to  tell the server to delete a specific note.*/
const deleteNote = (id) =>

    fetch(`/api/notes/${id}`, {

        method: 'DELETE',
        headers: {

            'Content-Type': 'application/json'
        }
    });

/*This function is called when a note is clicked on, and it displays the note's
text and title on the left side of the screen.*/
const renderActiveNote = () => {

    hide(saveNoteBtn);
    hide(clearBtn);

    if (activeNote.id) {

        show(newNoteBtn);
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;

    } else {

        hide(newNoteBtn);
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
    }
};

/* This function calls the appropriate other functions 
that deal with saving a note and rendering all the notes. */
const handleNoteSave = () => {

    const newNote = {

        title: noteTitle.value,
        text: noteText.value
    };

    saveNote(newNote).then(() => {

        getAndRenderNotes();
        renderActiveNote();
    });

  
};

// This function deals with deleting a clicked note.
const handleNoteDelete = (e) => {

  // This function prevents the click listener for the list from being called when the button inside of it is clicked.
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {

        activeNote = {};
    }

    deleteNote(noteId).then(() => {

        getAndRenderNotes();
        renderActiveNote();
    });

};

// This function sets the activeNote and displays it.
const handleNoteView = (e) => {

    e.preventDefault();
    if(e.target.tagName === 'span'){

        activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    
    } else {

        activeNote = JSON.parse(e.target.getAttribute('data-note'));
    } 
    
    renderActiveNote();
};

// This function sets the activeNote to an empty object and allows the user to enter a new note.
const handleNewNoteView = (e) => {

    activeNote = {};
    show(clearBtn);
    renderActiveNote();
};

// This function renders the appropriate buttons based on the state of the form.
const handleRenderBtns = () => {
  
    show(clearBtn);
  
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
    
        hide(clearBtn);
  
    } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    
        hide(saveNoteBtn);
  
    } else {

        show(saveNoteBtn);
    }
};

// This function renders the list of note titles.
const renderNoteList = async (notes) => {

    let jsonNotes = await notes.json();

    if (window.location.pathname === '/notes') {

        noteList.forEach((el) => (el.innerHTML = ''));
    }

  

    let noteListItems = [];

    // This function returns an HTML element with or without a delete button.
    const createLi = (text, delBtn = true) => {

        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = text;
        liEl.addEventListener('click', handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            
            delBtnEl.classList.add(
            'fas',
            'fa-trash-alt',
            'float-right',
            'text-danger',
            'delete-note'
            );

            delBtnEl.addEventListener('click', handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

  if (jsonNotes.length === 0) {

        noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {

        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

const preventFormSubmission = (event) => {

    event.preventDefault();
}

// This function gets the saved notes from the notes.json file and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {

    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);
    noteForm.addEventListener('submit', preventFormSubmission)
}

// This function call displays the notes when the page first loads.
getAndRenderNotes();
