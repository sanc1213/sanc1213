import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, LayoutGrid, Lock, SlidersHorizontal } from 'lucide-react';
import type { Profile, TabId } from './types';
import { coverGradients, initialProfile } from './mockData';
import { ProfileHeader } from './components/ProfileHeader';
import { OverviewTab } from './components/OverviewTab';
import { SecurityTab } from './components/SecurityTab';
import { PreferencesTab } from './components/PreferencesTab';
import { BillingTab } from './components/BillingTab';
import { cx } from './components/ui';
import { ToastProvider, useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';

const allTabs = [
  { id: 'overview', label: 'Overview', I: LayoutGrid, private: false },
  { id: 'security', label: 'Account & Security', I: Lock, private: true },
  { id: 'preferences', label: 'Preferences', I: SlidersHorizontal, private: false },
  { id: 'billing', label: 'Billing & Plan', I: CreditCard, private: true },
] as const;

function Hub() {
  const toast = useToast();
  const theme = useTheme();
  const [tab, setTab] = useState<TabId>('overview');
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [publicMode, setPublicMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [cover, setCover] = useState(coverGradients[0]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const tabs = allTabs.filter((t) => !(publicMode && t.private));
  useEffect(() => { if (!tabs.some((t) => t.id === tab)) setTab('overview'); }, [tabs, tab]);

  const patch = (p: Partial<Profile>) => setProfile((x) => ({ ...x, ...p }));
  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === tab);
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1; else return;
    e.preventDefault(); setTab(tabs[n].id);
    listRef.current?.querySelectorAll<HTMLElement>('[role=tab]')[n]?.focus();
  };

  return (
    <div className="min-h-screen">
      <div className="aurora" aria-hidden><i /></div><div className="aurora-grid" aria-hidden />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 dark:focus:bg-zinc-900">Skip to content</a>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        {publicMode && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="status"
            className="glass rounded-2xl px-4 py-2.5 text-sm text-accent">
            Public mode — this is how other people see your profile. Private tabs and edit controls are hidden.
          </motion.div>
        )}
        <ProfileHeader profile={profile} publicMode={publicMode} editing={editing && !publicMode} cover={cover} avatar={avatar}
          onCover={setCover} onAvatar={setAvatar} onStatus={(status) => patch({ status })}
          onTogglePublic={() => { setPublicMode((v) => !v); setEditing(false); toast(publicMode ? 'Back to owner view' : 'Previewing public profile', 'info'); }}
          onToggleEdit={() => { setEditing((v) => !v); if (!editing) toast('Edit mode on — update your bio and skills', 'info'); }} />

        <div className="sticky top-0 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div ref={listRef} role="tablist" aria-label="Profile sections" onKeyDown={onKey} className="glass no-scrollbar mt-1 flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl p-1.5">
            {tabs.map(({ id, label, I }) => (
              <button key={id} role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls={`panel-${id}`} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)}
                className={cx('relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                  tab === id ? 'text-white' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200')}>
                {tab === id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-xl btn-glow" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                <span className="relative flex items-center gap-2"><I size={15} aria-hidden />{label}</span>
              </button>
            ))}
          </div>
        </div>

        <main id="main">
          <AnimatePresence mode="wait">
            <motion.div key={tab} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tab === 'overview' && <OverviewTab profile={profile} editing={editing && !publicMode} onChange={patch} />}
              {tab === 'security' && <SecurityTab profile={profile} onChange={patch} readOnly={publicMode} />}
              {tab === 'preferences' && <PreferencesTab {...theme} readOnly={publicMode} />}
              {tab === 'billing' && <BillingTab readOnly={publicMode} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() { return <ToastProvider><Hub /></ToastProvider>; }
