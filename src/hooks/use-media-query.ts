'use client'

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = window.matchMedia(query);
    setValue(result.matches);

    // Esto es para la compatibilidad con Safari
    if (result.addEventListener) {
        result.addEventListener('change', onChange);
    } else {
        result.addListener(onChange);
    }

    return () => {
        if (result.removeEventListener) {
            result.removeEventListener('change', onChange);
        } else {
            result.removeListener(onChange);
        }
    };
  }, [query]);

  return value;
}
