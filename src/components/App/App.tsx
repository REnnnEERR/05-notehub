import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes, deleteNote, createNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

const App = () => {
  const queryClient = useQueryClient();
  
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const handleSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 500);

  const onSearchChange = (value: string) => {
    setSearch(value);
    handleSearch(value);
  };

  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
  });

  
  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Нотатку успішно видалено!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => toast.error('Не вдалося видалити нотатку...'),
  });

  
  const { mutate: addNote } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Нотатка успішно створена!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false); 
    },
    onError: () => toast.error('Помилка при створенні нотатки'),
  });

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={onSearchChange} />

        <div style={{ flexGrow: 1 }}></div> 

        {data && data.totalPages > 1 && (
          <Pagination 
            pageCount={data.totalPages} 
            onPageChange={handlePageClick} 
          />
        )}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p className={css.status}>Завантаження нотаток...</p>}
        {isError && <p className={css.status}>Помилка завантаження. Перевір токен!</p>}
        
        {data && data.notes.length > 0 ? (
          <NoteList 
            notes={data.notes} 
            onDelete={(id) => removeNote(id)} 
          />
        ) : (
          !isLoading && <p className={css.status}>Нотаток не знайдено...</p>
        )}
      </main>

      {/* Модалка з формою */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm 
            onSubmit={(values) => addNote(values)} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default App;