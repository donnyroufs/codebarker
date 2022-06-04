import { useState, useEffect } from 'react';

export enum LocalStorageItem {
  ExcludeFilter = 'cod-excludeFilter',
}

export function useLocalStorage<T>(
  key: LocalStorageItem,
  defaultValue: T
): [T, (data: T) => void] {
  const [value, setValue] = useState(() => {
    let currentValue: T;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
