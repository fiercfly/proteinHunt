import { useState, useCallback, useEffect } from 'react';
import { debounce } from '../utils/helpers';
import { useLocalStorage } from './useLocalStorage';

/**
 * useSearch — debounced search with history
 *
 * Returns:
 *   query        — current debounced query (use this for API calls)
 *   inputValue   — raw input value (use this for the input field)
 *   setInput     — update input (triggers debounced query after delay)
 *   clear        — reset both to ''
 *   history      — last 5 searches (persisted in localStorage)
 *   clearHistory — wipe search history
 */
export function useSearch(delay = 300) {
  const [inputValue, setInputValue]   = useState('');
  const [query,      setQuery]        = useState('');
  const [history,    setHistory]      = useLocalStorage('dp_search_history', []);

  // Debounced function — recreated only when delay changes
  const debouncedSet = useCallback(
    debounce((val) => setQuery(val), delay),
    [delay]
  );

  const setInput = useCallback((val) => {
    setInputValue(val);
    debouncedSet(val);
  }, [debouncedSet]);

  // Save to history when query settles on a non-empty value
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;
    setHistory(prev => {
      const filtered = prev.filter(h => h !== query.trim());
      return [query.trim(), ...filtered].slice(0, 5);
    });
  }, [query]); // eslint-disable-line

  const clear = useCallback(() => {
    setInputValue('');
    setQuery('');
  }, []);

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  return { query, inputValue, setInput, clear, history, clearHistory };
}