import React from 'react';

const NoteList = ({ notes, onNoteClick, activeNote }) => {
  return (
    <div>
      <ul>
        {notes.map((note) => {
          // Преобразование строки времени в объект Date
          const createdAtDate = new Date(note.createdAt);
          // Получение времени в локальном формате с параметрами для настройки
          const options = { 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
          };
          const createdTime = createdAtDate.toLocaleTimeString('en-US', options);
          
          return (
            <li 
              className={note === activeNote ? 'notelist_btn active' : 'notelist_btn'} 
              key={note.id} 
              onClick={() => onNoteClick(note)} 
            >
              {note.title}
              <p className='data_notes'>{createdTime}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NoteList;
