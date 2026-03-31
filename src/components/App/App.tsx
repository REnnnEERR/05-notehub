import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

const App = () => {
  // 1. Стейт для пагінації, пошуку та модалки
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Дебаунс для пошуку
  const handleSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1); // Скидаємо на 1 сторінку при новому пошуку
  }, 500);

  const onSearchChange = (value: string) => {
    setSearch(value);
    handleSearch(value);
  };

  // 3. Отримання даних (Завдання 8 - додано placeholderData)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: keepPreviousData, // Рятує від мерехтіння при зміні сторінок
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
            currentPage={page} // Передаємо поточну сторінку (Завдання 6)
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
          <NoteList notes={data.notes} /> 
        ) : (
          !isLoading && <p className={css.status}>Нотаток не знайдено...</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;