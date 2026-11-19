import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Camera, Check, Code2, Eye, Github, Globe, ImagePlus, Linkedin, Link2, MapPin, Pencil, Share2, Upload } from 'lucide-react';
import type { Profile } from '../types';
import { coverGradients } from '../mockData';
import { Button, Overlay, cx } from './ui';
import { useToast } from '../hooks/useToast';

const icons = { github: Github, linkedin: Linkedin, code: Code2, globe: Globe };
const statusColor = { online: 'bg-emerald-500', away: 'bg-amber-500', busy: 'bg-red-500', offline: 'bg-zinc-400' };

function useLocalTime(tz: string) {
  const fmt = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const i = setInterval(() => setT(fmt()), 30000); return () => clearInterval(i); }, [tz]); // eslint-disable-line react-hooks/exhaustive-deps
  return t;
}

interface Props {
  profile: Profile; publicMode: boolean; editing: boolean; cover: string; avatar: string | null;
  onCover: (c: string) => void; onAvatar: (a: string) => void; onStatus: (s: Profile['status']) => void;
  onTogglePublic: () => void; onToggleEdit: () => void;
}

export function ProfileHeader({ profile, publicMode, editing, cover, avatar, onCover, onAvatar, onStatus, onTogglePublic, onToggleEdit }: Props) {
  const toast = useToast();
  const [coverOpen, setCoverOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [draftCover, setDraftCover] = useState(cover);
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const time = useLocalTime(profile.timezone);

  const readFile = (f: File | undefined, cb: (s: string) => void) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('Please choose an image file', 'error');
    if (f.size > 5 * 1024 * 1024) return toast('Image must be under 5 MB', 'error');
    const r = new FileReader(); r.onload = () => cb(String(r.result)); r.readAsDataURL(f);
  };
  const share = async () => {
    const url = `${location.origin}/u/${profile.handle}`;
    try { await navigator.clipboard.writeText(url); toast('Profile link copied to clipboard'); } catch { toast(url, 'info'); }
  };
  const bg = (c: string) => (c.startsWith('data:') ? { backgroundImage: `url(${c})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundImage: c });
  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <header className="glass overflow-hidden rounded-[22px]">
      <div className="relative h-40 sm:h-56" style={bg(cover)} role="img" aria-label="Profile cover banner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,rgb(255_255_255/.35),transparent_55%)]" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent dark:from-zinc-900/80" aria-hidden />
        {!publicMode && (
          <Button size="sm" className="absolute right-3 top-3 bg-white/90 backdrop-blur dark:bg-zinc-900/80" onClick={() => { setDraftCover(cover); setCoverOpen(true); }}>
            <ImagePlus size={14} /> Change Cover
          </Button>
        )}
      </div>

      <div className="px-5 pb-5 sm:px-7">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="group relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-accent to-pink-500 shadow-xl shadow-accent/30 dark:border-zinc-900 sm:h-28 sm:w-28">
                {avatar ? <img src={avatar} alt={`${profile.name} avatar`} className="h-full w-full object-cover" />
                  : <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white" aria-label={`${profile.name} avatar`}>{initials}</span>}
                {!publicMode && (
                  <button onClick={() => avatarRef.current?.click()} aria-label="Change avatar"
                    className="absolute inset-0 flex items-center justify-center bg-zinc-950/55 text-white opacity-0 transition focus-visible:opacity-100 group-hover:opacity-100">
                    <Camera size={20} />
                  </button>
                )}
                <input ref={avatarRef} type="file" accept="image/*" hidden onChange={(e) => readFile(e.target.files?.[0], (s) => { onAvatar(s); toast('Avatar updated'); })} />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <button disabled={publicMode} onClick={() => setStatusOpen((o) => !o)} aria-label={`Availability: ${profile.status}. Change status`} aria-expanded={statusOpen}
                  className={cx('h-5 w-5 rounded-full border-[3px] border-white dark:border-zinc-900', statusColor[profile.status])} />
                <AnimatePresence>
                  {statusOpen && (
                    <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="menu"
                      className="absolute left-0 top-7 z-20 w-32 rounded-lg border border-zinc-200 bg-white p-1 text-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                      {(['online', 'away', 'busy', 'offline'] as const).map((s) => (
                        <li key={s} role="none">
                          <button role="menuitem" onClick={() => { onStatus(s); setStatusOpen(false); toast(`Status set to ${s}`); }}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 capitalize hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <span className={cx('h-2 w-2 rounded-full', statusColor[s])} /> {s}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!publicMode && (
              <Button variant={editing ? 'primary' : 'secondary'} onClick={onToggleEdit} aria-pressed={editing}>
                {editing ? <><Check size={15} /> Done Editing</> : <><Pencil size={15} /> Edit Profile</>}
              </Button>
            )}
            <Button onClick={share}><Share2 size={15} /> Share Profile</Button>
            <Button variant={publicMode ? 'primary' : 'secondary'} onClick={onTogglePublic} aria-pressed={publicMode}>
              <Eye size={15} /> {publicMode ? 'Exit Public Mode' : 'View Public Mode'}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gradient">{profile.name}</h1>
            {profile.verified && <BadgeCheck size={20} className="text-accent" aria-label="Verified account" />}
            <span className="text-sm text-zinc-500 dark:text-zinc-400">@{profile.handle}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{profile.headline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden /> {profile.location}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden /> {time} local time</span>
            {profile.links.map((l) => {
              const I = icons[l.icon] ?? Link2;
              return (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded text-zinc-700 underline-offset-4 hover:text-accent hover:underline dark:text-zinc-300">
                  <I size={14} aria-hidden /> {l.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <Overlay open={coverOpen} onClose={() => setCoverOpen(false)} title="Change cover">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Cover gradients">
          {coverGradients.map((g) => (
            <button key={g} role="radio" aria-checked={draftCover === g} aria-label="Gradient option" onClick={() => setDraftCover(g)}
              className={cx('relative h-14 rounded-lg border-2', draftCover === g ? 'border-accent' : 'border-transparent')} style={{ backgroundImage: g }}>
              {draftCover === g && <Check size={16} className="absolute right-1.5 top-1.5 text-white drop-shadow" />}
            </button>
          ))}
        </div>
        <Button className="mt-3 w-full" onClick={() => fileRef.current?.click()}><Upload size={14} /> Upload image</Button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => readFile(e.target.files?.[0], setDraftCover)} />
        <p className="mb-1.5 mt-4 text-xs font-medium text-zinc-500">Preview</p>
        <div className="h-24 rounded-lg border border-zinc-200 dark:border-zinc-800" style={bg(draftCover)} />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCoverOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { onCover(draftCover); setCoverOpen(false); toast('Cover updated'); }}>Apply</Button>
        </div>
      </Overlay>
    </header>
  );
}
