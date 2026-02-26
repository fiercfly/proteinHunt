import { useState } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const set = (val) => {
    const next = typeof val === 'function' ? val(value) : val;
    setValue(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  return [value, set];
}