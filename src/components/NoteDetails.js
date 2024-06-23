import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const NoteDetails = ({ note, onNoteUpdated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  useEffect(() => {
    autoResizeTextarea();
  }, [content]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (note && note.id) {
          const img_response = await axios.get(`http://localhost:3001/notes/${note.id}/images`);
          setImages(img_response.data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchData();
  }, [note]);

  const handleUpdateNote = async () => {
    try {
      const requestData = {
        title: title,
        content: content
      };

      const response = await axios.put(`http://localhost:3001/notes/${note.id}`, requestData, {
        headers: {
          'Content-Type': 'application/json' // Устанавливаем заголовок для отправки данных в формате JSON
        }
      });

      onNoteUpdated(response.data);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post(`http://localhost:3001/notes/${note.id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload response:', response.data); // Добавлено для отладки

      // Проверяем, что response.data является массивом, перед добавлением в состояние
      if (Array.isArray(response.data)) {
        setImages(prevImages => [...prevImages, ...response.data]);
      } else if (response.data.images && Array.isArray(response.data.images)) {
        setImages(prevImages => [...prevImages, ...response.data.images]);
      } else {
        console.error('Unexpected response data format:', response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/notes/images/${selectedImageId}`);
      setImages(images.filter(image => image.id !== selectedImageId));
      setSelectedImageId(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleImageClick = (imageId) => {
    setSelectedImageId(imageId === selectedImageId ? null : imageId);
  };

  if (!note) {
    return <div style={{ margin: '20px' }}>Выберите заметку</div>;
  }

  const createdAtDate = new Date(note.createdAt);
  const createdDate = createdAtDate.toLocaleDateString();

  return (
    <div className='details'>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='details_container'>
          <div className='details_main'>
            <div style={{ display: 'flex' }}>
              <div className='title_notes'>{createdDate}</div>
              <img onClick={() => fileInputRef.current.click()} src="/img/free-icon-image-gallery-8191558.png" alt="Upload icon" className='create_img' />
              <img onClick={handleImageDelete} disabled={!selectedImageId} src="/img/free-icon-bin-10741274 (1).png" alt="Delete icon" className='create_img' />
            </div>
            <div style={{ marginTop: '20px' }}>
              {images && images.map(image => (
                <img
                  key={image.id}
                  className={selectedImageId === image.id ? 'details_img selected' : 'details_img'}
                  src={`http://localhost:3000/${image.imgPath}`}
                  alt=""
                  onClick={() => handleImageClick(image.id)}
                />
              ))}
            </div>
            <input
              className='input'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              style={{ overflow: 'hidden' }}
            />
            <input
              type='file'
              ref={fileInputRef}
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }} // Скрыть элемент ввода файла
            />
          </div>
          <button className='details_btn' onClick={handleUpdateNote}>
            Обновить заметку
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
