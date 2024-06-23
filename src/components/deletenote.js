// DeleteNote.js
import React from 'react';
import axios from 'axios';

const DeleteNote = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/notes/${id}`);
      onDelete(id); // Вызываем функцию onDelete с передачей id удаленной заметки
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      <img onClick={handleDelete} src="/img/free-icon-bin-10741274 (1).png" alt="Delete icon" className='create_img' />

      
      
    </div>
  );
};

export default DeleteNote;
