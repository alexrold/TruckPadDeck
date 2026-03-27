import {useState} from 'react';

/**
 * useDashboardSearch - Control del estado de la búsqueda en la biblioteca.
 * Aísla el estado local del texto de búsqueda para evitar propagación de 
 * renders innecesarios en la estructura global del Home.
 */
export const useDashboardSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return {
    searchQuery,
    setSearchQuery,
  };
};
