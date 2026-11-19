import { useState } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import type { Channel, NotifRow, ThemeMode } from '../types';
import { accents, initialNotifs } from '../mockData';
import { Card, Skeleton, Toggle, cx } from './ui';
import { useLoading } from '../hooks/useLoading';
import { useToast } from '../hooks/useToast';

interface Props { mode: ThemeMode; setMode: (m: ThemeMode) => void; accent: string; setAccent: (a: string) => void; readOnly: boolean }
const modes = [{ id: 'light', label: 'Light', I: Sun }, { id: 'dark', label: 'Dark', I: Moon }, { id: 'system', label: 'System', I: Monitor }] as const;
const channels: { id: Channel; label: string }[] = [{ id: 'email', label: 'Email' }, { id: 'push', label: 'Push' }, { id: 'inapp', label: 'In-app' }];

export function PreferencesTab({ mode, setMode, accent, setAccent, readOnly }: Props) {
  const loading = useLoading('prefs');
  const toast = useToast();
  const [rows, setRows] = useState<NotifRow[]>(initialNotifs);

  if (loading) return <div className="grid gap-4 lg:grid-cols-5" aria-busy="true"><Skeleton className="h-72 lg:col-span-3" /><Skeleton className="h-72 lg:col-span-2" /></div>;

  const flip = (id: string, ch: Channel, v: boolean) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [ch]: v } : x)));
    toast(`${v ? 'Enabled' : 'Disabled'} ${channels.find((c) => c.id === ch)!.label.toLowerCase()} notifications`, 'info');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card title="Notifications" className="lg:col-span-3">
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[480px] text-sm">
            <thead><tr className="text-xs text-zinc-500"><th className="pb-3 text-left font-medium">Event</th>{channels.map((c) => <th key={c.id} className="w-20 pb-3 text-center font-medium">{c.label}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-zinc-100 dark:border-zinc-800">
                  <th scope="row" className="py-3 pr-3 text-left font-normal"><p className="font-medium">{r.label}</p><p className="text-xs text-zinc-500 dark:text-zinc-400">{r.desc}</p></th>
                  {channels.map((c) => (
                    <td key={c.id} className="py-3 text-center">
                      <div className="flex justify-center"><Toggle label={`${r.label} via ${c.label}`} checked={r[c.id]} onChange={(v) => !readOnly && flip(r.id, c.id, v)} /></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-4 lg:col-span-2">
        <Card title="Appearance">
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
            {modes.map(({ id, label, I }) => (
              <button key={id} role="radio" aria-checked={mode === id} onClick={() => { setMode(id); toast(`${label} theme applied`, 'info'); }}
                className={cx('flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition', mode === id ? 'border-accent bg-accent/10 text-accent' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800')}>
                <I size={18} aria-hidden />{label}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Accent color">
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Accent color">
            {accents.map((a) => (
              <button key={a.name} role="radio" aria-checked={accent === a.rgb} aria-label={a.name} title={a.name} onClick={() => { setAccent(a.rgb); toast(`Accent set to ${a.name}`, 'info'); }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-offset-2 ring-offset-white transition hover:scale-110 dark:ring-offset-zinc-900"
                style={{ backgroundColor: `rgb(${a.rgb})`, boxShadow: accent === a.rgb ? `0 0 0 2px rgb(${a.rgb})` : undefined }}>
                {accent === a.rgb && <Check size={16} />}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
