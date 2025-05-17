import { useState, useEffect, React } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import '../App.css';

function Add() {

  function reloadPage(){
    window.location.reload(false)
  }
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const note = { title: noteTitle, noteContent };

    fetch('https://notes-3j0d.onrender.com/api/notes', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note)
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to save note");
        return response.json();
      })
      .then(() => {
        setNoteTitle("");
        setNoteContent("");
        reloadPage(); 
      })
      .catch(error => console.error("Error adding note:", error));
  };

  return (
    <div>
      <div className="header">
        <h1>My Notes App</h1>
        <p>@ryantresmanio</p>
      </div>

      <div className="add-container">
        <Paper 
            elevation={3} 
            className="note-form-paper"
            style={{backgroundColor: '#F2F2F2'}}
            >
          <form onSubmit={handleSubmit} className="note-form">
            <div className="input-title">
              <TextField
                label="Title"
                variant="outlined"
                multiline
                maxRows={1}
                fullWidth
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: "solid #9FB3DF 3px" // default border
                    },
                    '&:hover fieldset': {
                      borderColor: 'darkblue', // on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'navy', // on focus
                    },
                  },
                }}
              />
            </div>
            <div className="input-content">
              <TextField
                label="Create new note"
                variant="outlined"
                multiline
                maxRows={10}
                fullWidth
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                error={noteContent.length >= 255}
                helperText={
                  noteContent.length >= 255
                    ? "Too long (maximum 255 characters)"
                    : `${noteContent.length}/255`
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: "solid #9FB3DF 3px" // default border
                    },
                    '&:hover fieldset': {
                      borderColor: 'darkblue', // on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'navy', // on focus
                    },
                  },
                }}
              />
            </div>
            <Button variant="contained" disableElevation type="submit">
              Submit
            </Button>
          </form>
        </Paper>
        
      </div>
    </div>
  );
}

export default Add;
