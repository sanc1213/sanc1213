import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ExternalLink, GitPullRequest, Rocket, ShieldCheck, Pencil, Plus, X } from 'lucide-react';
import type { ActivityKind, Profile } from '../types';
import { activities, buildHeatmap, metrics, pinned } from '../mockData';
import { Badge, Button, Card, Skeleton, cx } from './ui';
import { useLoading } from '../hooks/useLoading';
import { useToast } from '../hooks/useToast';

const filters: { id: 'all' | ActivityKind; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'project', label: 'Projects' }, { id: 'review', label: 'Reviews' }, { id: 'system', label: 'System' },
];
const kindIcon = { project: Rocket, review: GitPullRequest, system: ShieldCheck };
const levelCls = ['bg-zinc-100 dark:bg-zinc-800', 'bg-accent/25', 'bg-accent/50', 'bg-accent/75', 'bg-accent'];

interface Props { profile: Profile; editing: boolean; onChange: (p: Partial<Profile>) => void }

export function OverviewTab({ profile, editing, onChange }: Props) {
  const loading = useLoading('overview');
  const toast = useToast();
  const [filter, setFilter] = useState<'all' | ActivityKind>('all');
  const [bio, setBio] = useState(profile.bio);
  const [skill, setSkill] = useState('');
  const heat = useMemo(buildHeatmap, []);
  const feed = activities.filter((a) => filter === 'all' || a.kind === filter);
  const total = heat.flat().reduce((s, l) => s + l, 0) * 3;

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3" aria-busy="true" aria-label="Loading overview">
        <Skeleton className="h-60 lg:col-span-2" /><Skeleton className="h-60" />
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
        <Skeleton className="h-52 lg:col-span-2" /><Skeleton className="h-52" />
      </div>
    );
  }

  const addSkill = () => {
    const v = skill.trim();
    if (!v) return;
    if (profile.skills.some((s) => s.toLowerCase() === v.toLowerCase())) return toast('Skill already added', 'info');
    onChange({ skills: [...profile.skills, v] }); setSkill(''); toast(`Added ${v}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Card title="About" className="lg:col-span-8"
        action={editing && <Badge tone="accent"><Pencil size={11} /> Editing</Badge>}>
        {editing ? (
          <div>
            <label htmlFor="bio" className="sr-only">Bio</label>
            <textarea id="bio" rows={5} maxLength={400} value={bio} onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white/70 p-3 text-sm dark:border-white/10 dark:bg-black/30" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{bio.length}/400</span>
              <Button size="sm" variant="primary" disabled={!bio.trim()} onClick={() => { onChange({ bio }); toast('Bio saved'); }}>Save bio</Button>
            </div>
          </div>
        ) : <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{profile.bio}</p>}

        <h4 className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-zinc-500">Tech stack</h4>
        <ul className="flex flex-wrap gap-1.5">
          {profile.skills.map((s) => (
            <li key={s}><Badge tone="neutral">{s}
              {editing && <button aria-label={`Remove ${s}`} onClick={() => onChange({ skills: profile.skills.filter((x) => x !== s) })}><X size={11} /></button>}
            </Badge></li>
          ))}
        </ul>
        {editing && (
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); addSkill(); }}>
            <label className="sr-only" htmlFor="skill">Add skill</label>
            <input id="skill" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Add a skill…"
              className="w-48 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-950" />
            <Button size="sm" type="submit"><Plus size={13} /> Add</Button>
          </form>
        )}
        <h4 className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-zinc-500">Languages</h4>
        <div className="flex gap-1.5">{profile.languages.map((l) => <Badge key={l} tone="accent">{l}</Badge>)}</div>
      </Card>

      <Card title="Pinned" className="lg:col-span-4" action={<span className="text-xs text-zinc-500">{pinned.length} featured</span>}>
        <ul className="space-y-3">
          {pinned.map((p) => (
            <li key={p.id}>
              <motion.a href={p.url} target="_blank" rel="noreferrer"
                className="group lift flex gap-3 rounded-xl border border-zinc-200/70 bg-white/40 p-2.5 dark:border-white/10 dark:bg-white/5">
                <div className="h-14 w-14 shrink-0 rounded-xl shadow-lg" style={{ backgroundImage: p.gradient }} aria-hidden />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-sm font-medium">{p.title}<ExternalLink size={12} className="text-zinc-400 group-hover:text-accent" aria-label="opens in new tab" /></p>
                  <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{p.description}</p>
                  <div className="mt-1 flex flex-wrap gap-1">{p.tags.map((t) => <span key={t} className="rounded bg-zinc-100 px-1.5 py-px text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{t}</span>)}</div>
                </div>
              </motion.a>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const up = m.trend >= 0;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass lift group relative overflow-hidden rounded-card p-4">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/20 blur-2xl transition group-hover:bg-accent/40" aria-hidden />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{m.label}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-gradient">{m.value}</p>
              <p className={cx('mt-1 flex items-center gap-1 text-xs font-medium', up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                {up ? <ArrowUpRight size={13} aria-label="up" /> : <ArrowDownRight size={13} aria-label="down" />}{Math.abs(m.trend)}%
                <span className="font-normal text-zinc-500">{m.hint}</span>
              </p>
            </motion.div>
          );
        })}
      </div>

      <Card title="Contribution activity" className="lg:col-span-7" action={<span className="text-xs text-zinc-500">{total.toLocaleString()} in the last year</span>}>
        <div className="no-scrollbar overflow-x-auto pb-1">
          <div className="flex w-max gap-1" role="img" aria-label={`Contribution heatmap, ${total} contributions in the last year`}>
            {heat.map((week, w) => (
              <div key={w} className="flex flex-col gap-1">
                {week.map((l, d) => <div key={d} title={`${l * 3} contributions`} className={cx('h-[14px] w-[14px] rounded-[4px]', levelCls[l])} />)}
              </div>
            ))}
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-200/70 pt-4 text-center dark:border-white/10">
          {[['Current streak', '12 days'], ['Longest streak', '41 days'], ['Best day', 'Thursday']].map(([k, v]) => (
            <div key={k}><dt className="text-xs text-zinc-500">{k}</dt><dd className="text-lg font-semibold text-gradient">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-zinc-500">Less {levelCls.map((c, i) => <span key={i} className={cx('h-[14px] w-[14px] rounded-[4px]', c)} />)} More</div>
      </Card>

      <Card title="Recent activity" className="lg:col-span-5">
        <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Activity filter">
          {filters.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
              className={cx('rounded-full border px-2.5 py-1 text-xs font-medium transition', filter === f.id ? 'border-accent bg-accent/10 text-accent' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800')}>
              {f.label}
            </button>
          ))}
        </div>
        <ol className="relative space-y-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
          <AnimatePresence mode="popLayout" initial={false}>
            {feed.map((a) => {
              const I = kindIcon[a.kind];
              return (
                <motion.li key={a.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="relative">
                  <span className="absolute -left-[25px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-accent ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700"><I size={10} /></span>
                  <p className="text-sm font-medium leading-snug">{a.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{a.detail} · {a.time}</p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </Card>
    </div>
  );
}
