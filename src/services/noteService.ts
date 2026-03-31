import axios from 'axios';
import type { Note } from '../types/note';


const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const noteApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  search: string = '',
  perPage: number = 12
): Promise<FetchNotesResponse> => {
  const response = await noteApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
    },
  });
  return response.data;
};


export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(`/notes/${noteId}`);
  return response.data;
};