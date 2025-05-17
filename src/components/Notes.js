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
  const [pendingDeleteId, setPendingDeleteId] = useState(null); 

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

  // Delete the note after the menu closes
  useEffect(() => {
    // When menu closes (anchorEl === null) and there's a pending delete ID
    if (!anchorEl && pendingDeleteId) {
      fetch(`https://notes-3j0d.onrender.com/api/notes/${pendingDeleteId}`, {
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
          setNotes(data);
          setPendingDeleteId(null);
          setSelectedNoteId(null);
        })
        .catch(error => {
          console.error('Error deleting note:', error);
          setPendingDeleteId(null);
          setSelectedNoteId(null);
        });
    }
  }, [anchorEl, pendingDeleteId]);

  const handleMenuOpen = (event, noteId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNoteId(noteId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedNoteId here, we need it after menu closes for delete
  };

  // set the pending delete ID and close the menu
  const handleDeleteClick = () => {
    if (!selectedNoteId) return;
    setPendingDeleteId(selectedNoteId);
    handleMenuClose();
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <div
        className="notes-wrapper"
        style={{
          padding: '30px',
          margin: 'auto 100px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
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
              position: 'relative', 
            }}
          >
      
            <IconButton
              aria-label="more"
              onClick={e => handleMenuOpen(e, note.id)}
              style={{ position: 'absolute', top: '5px', right: '5px' }}
            >
              <MoreVertIcon />
            </IconButton>

            <h2>{note.title}</h2>
            <p>{note.noteContent}</p>
          </Paper>
        ))}
      </div>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default Notes;
