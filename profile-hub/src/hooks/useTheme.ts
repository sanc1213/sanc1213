import { useCallback, useEffect, useState } from 'react';
import type { ThemeMode } from '../types';

const read = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => read<ThemeMode>('hub.theme', 'system'));
  const [accent, setAccentState] = useState<string>(() => read('hub.accent', '99 102 241'));

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.classList.toggle('dark', mode === 'dark' || (mode === 'system' && mq.matches));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  const setMode = useCallback((m: ThemeMode) => { setModeState(m); write('hub.theme', m); }, []);
  const setAccent = useCallback((a: string) => { setAccentState(a); write('hub.accent', a); }, []);
  return { mode, setMode, accent, setAccent };
}
