// Notes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from './NoteList';
import NoteDetails from './NoteDetails';
import DeleteNote from './deletenote';
import "../App.css"

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleCreateNote = async () => {
    try {
      const response = await axios.post('http://localhost:3001/notes', {
        title: 'New title',
        content: 'New content'
      });
      const newNote = response.data;
      setNotes([...notes, newNote]);
      setSelectedNote(newNote); // Устанавливаем новую заметку в качестве выбранной
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note.');
    }
  };

  const handleNoteUpdated = (updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  };

  const handleNoteDeleted = (deletedNoteId) => {
    const updatedNotes = notes.filter((note) => note.id !== deletedNoteId);
    setNotes(updatedNotes);
    setSelectedNote(null); // Сбрасываем выбранную заметку, если она была удалена
  };

  return (
    <div className="notes-container">
      <div className="notes-list">
        <h1 className='title_notes'>Notes</h1>
        <div style={{display:'flex', justifyContent:'right'}}>
        {selectedNote && <DeleteNote id={selectedNote.id} onDelete={handleNoteDeleted} />}
        <img onClick={handleCreateNote} src="/img/free-icon-add-task-12693763.png" alt="Plus icon" className='create_img'/>
        </div>
        <NoteList notes={notes} onNoteClick={handleNoteClick} activeNote={selectedNote} />
      </div>
      <div className="note-details">
        <NoteDetails note={selectedNote} onNoteUpdated={handleNoteUpdated} />
      </div>
    </div>
  );
};

export default Notes;
