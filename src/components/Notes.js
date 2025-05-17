import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../App.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    fetch('https://notes-3j0d.onrender.com/api/notes')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setNotes(data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  const handleMenuOpen = (event, noteId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNoteId(noteId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNoteId(null);
  };

 const handleDelete = () => {
  if (!selectedNoteId) return;

  fetch(`https://notes-3j0d.onrender.com/api/notesnotes/${selectedNoteId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      return fetch('https://notes-3j0d.onrender.com/api/notes');
    })
    .then(res => res.json())
    .then(data => {
      setNotes(data); // update state with new notes list
      handleMenuClose();
    })
    .catch(error => {
      console.error('Error deleting note:', error);
      handleMenuClose();
    });
};

  return (
    <div style={{ marginTop: '50px' }}>
      <div className="notes-wrapper" style={{
        padding: '30px',
        margin: 'auto 100px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {notes.map(note => (
          <Paper
            key={note.id}
            elevation={3}
            style={{
              backgroundColor: '#F2F2F2',
              padding: '16px',
              maxWidth: '300px',
              minWidth: '300px',
              flex: '1 1 200px',
              position: 'relative' // for positioning the 3-dot button
            }}
          >
            {/* 3-dot menu button */}
            <IconButton
              aria-label="more"
              onClick={(e) => handleMenuOpen(e, note.id)}
              style={{ position: 'absolute', top: '5px', right: '5px' }}
            >
              <MoreVertIcon />
            </IconButton>

            <h2>{note.title}</h2>
            <p>{note.noteContent}</p>
          </Paper>
        ))}
      </div>

      {/* Menu that appears on 3-dot click */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default Notes;
