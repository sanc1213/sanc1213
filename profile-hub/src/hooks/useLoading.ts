import { useEffect, useState } from 'react';
/** Simulates an async fetch; re-runs when `key` changes. */
export function useLoading(key: unknown, ms = 650) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [key, ms]);
  return loading;
}
