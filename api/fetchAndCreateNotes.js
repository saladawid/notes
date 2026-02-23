// src/components/Notes.jsx
import api from '../utils/axios';

const fetchNotes = async () => {
  const response = await api.get('/notes');  // Token dodany automatycznie!
  setNotes(response.data);
};

const createNote = async (title) => {
  await api.post('/notes', { title });  // Token dodany automatycznie!
};
