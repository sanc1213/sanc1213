import { useMemo, useState } from 'react';
import { Laptop, Smartphone, KeyRound, ShieldCheck, Check, X } from 'lucide-react';
import type { Profile, Session } from '../types';
import { initialSessions } from '../mockData';
import { Badge, Button, Card, Field, Overlay, Skeleton, Toggle, cx } from './ui';
import { useLoading } from '../hooks/useLoading';
import { useToast } from '../hooks/useToast';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

/** Deterministic fake QR pattern (visual preview only). */
function QrPreview() {
  const cells = useMemo(() => {
    let seed = 7; const r = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    return Array.from({ length: 21 * 21 }, (_, i) => {
      const x = i % 21, y = Math.floor(i / 21);
      const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7;
      if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
        const fx = x % 14 < 7 ? x % 14 : x - 14, fy = y % 14 < 7 ? y % 14 : y - 14;
        return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
      }
      return r() > 0.5;
    });
  }, []);
  return (
    <div className="mx-auto grid w-40 rounded-lg bg-white p-2 ring-1 ring-zinc-200" style={{ gridTemplateColumns: 'repeat(21,1fr)' }} role="img" aria-label="Sample QR code for authenticator setup">
      {cells.map((c, i) => <span key={i} className={cx('aspect-square', c ? 'bg-zinc-900' : 'bg-white')} />)}
    </div>
  );
}

interface Props { profile: Profile; onChange: (p: Partial<Profile>) => void; readOnly: boolean }

export function SecurityTab({ profile, onChange, readOnly }: Props) {
  const loading = useLoading('security');
  const toast = useToast();
  const [form, setForm] = useState({ name: profile.name, email: profile.email, phone: profile.phone, location: profile.location });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ cur: '', next: '', conf: '' });
  const [twoFA, setTwoFA] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [code, setCode] = useState('');
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const errors = {
    name: form.name.trim().length < 2 ? 'Name must be at least 2 characters' : '',
    email: emailRe.test(form.email) ? '' : 'Enter a valid email address',
    phone: /^[+\d][\d\s-]{7,}$/.test(form.phone) ? '' : 'Enter a valid phone number',
    location: form.location.trim() ? '' : 'Location is required',
  };
  const dirty = (Object.keys(form) as (keyof typeof form)[]).some((k) => form[k] !== profile[k]);
  const valid = Object.values(errors).every((e) => !e);
  const bind = (k: keyof typeof form) => ({
    value: form[k], disabled: readOnly,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })), error: touched[k] ? errors[k] : '',
  });

  const pwErr = { next: pw.next && strength(pw.next) < 3 ? 'Use 8+ chars with upper-case, number or symbol' : '', conf: pw.conf && pw.conf !== pw.next ? 'Passwords do not match' : '' };
  const pwOk = pw.cur.length > 0 && strength(pw.next) >= 3 && pw.next === pw.conf;
  const s = strength(pw.next);

  if (loading) return <div className="grid gap-4 lg:grid-cols-2" aria-busy="true"><Skeleton className="h-80" /><Skeleton className="h-80" /><Skeleton className="h-64 lg:col-span-2" /></div>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Personal details" action={readOnly && <Badge>Read-only in public mode</Badge>}>
        <form className="space-y-3" noValidate onSubmit={(e) => {
          e.preventDefault(); setTouched({ name: true, email: true, phone: true, location: true });
          if (!valid) return toast('Please fix the highlighted fields', 'error');
          onChange(form); toast('Personal details saved');
        }}>
          <Field label="Full name" autoComplete="name" {...bind('name')} />
          <Field label="Email" type="email" autoComplete="email" {...bind('email')} />
          <Field label="Phone" type="tel" autoComplete="tel" {...bind('phone')} />
          <Field label="Location" {...bind('location')} />
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" disabled={!dirty || readOnly} onClick={() => { setForm({ name: profile.name, email: profile.email, phone: profile.phone, location: profile.location }); setTouched({}); }}>Reset</Button>
            <Button type="submit" variant="primary" disabled={!dirty || readOnly}>Save changes</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <Card title="Password">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><KeyRound size={18} className="text-zinc-500" aria-hidden /><div><p className="text-sm font-medium">Password</p><p className="text-xs text-zinc-500">Last changed 3 months ago</p></div></div>
            <Button disabled={readOnly} onClick={() => setPwOpen(true)}>Update</Button>
          </div>
        </Card>
        <Card title="Two-factor authentication">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><ShieldCheck size={18} className={twoFA ? 'text-emerald-500' : 'text-zinc-500'} aria-hidden />
              <div><p className="text-sm font-medium">Authenticator app</p><p className="text-xs text-zinc-500">{twoFA ? 'Enabled — your account is protected' : 'Add an extra layer of security'}</p></div></div>
            <Toggle label="Two-factor authentication" checked={twoFA} onChange={(v) => { if (readOnly) return; if (v) { setCode(''); setQrOpen(true); } else { setTwoFA(false); toast('2FA disabled', 'info'); } }} />
          </div>
        </Card>
      </div>

      <Card title="Active sessions" className="lg:col-span-2" action={
        <Button size="sm" variant="danger" disabled={readOnly || sessions.length <= 1} onClick={() => { setSessions((x) => x.filter((r) => r.current)); toast('All other sessions revoked'); }}>Revoke all others</Button>}>
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800">
              <th className="pb-2 font-medium">Device</th><th className="pb-2 font-medium">Browser</th><th className="pb-2 font-medium">IP address</th><th className="pb-2 font-medium">Last active</th><th className="pb-2"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {sessions.map((r) => {
                const I = r.kind === 'phone' ? Smartphone : Laptop;
                return (
                  <tr key={r.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                    <td className="py-3"><span className="flex items-center gap-2"><I size={15} className="text-zinc-500" aria-hidden />{r.device}{r.current && <Badge tone="green">This device</Badge>}</span></td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{r.browser}</td>
                    <td className="py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">{r.ip}<span className="block font-sans text-zinc-500">{r.location}</span></td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{r.last}</td>
                    <td className="py-3 text-right">{!r.current && <Button size="sm" variant="danger" disabled={readOnly} aria-label={`Revoke session on ${r.device}`} onClick={() => { setSessions((x) => x.filter((y) => y.id !== r.id)); toast(`Revoked ${r.device}`); }}>Revoke</Button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Overlay side open={pwOpen} onClose={() => setPwOpen(false)} title="Update password">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!pwOk) return; setPwOpen(false); setPw({ cur: '', next: '', conf: '' }); toast('Password updated'); }}>
          <Field label="Current password" type="password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} />
          <div>
            <Field label="New password" type="password" autoComplete="new-password" value={pw.next} error={pwErr.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            <div className="mt-2 flex gap-1" aria-hidden>{[1, 2, 3, 4].map((i) => <span key={i} className={cx('h-1 flex-1 rounded-full', i <= s ? ['', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'][s] : 'bg-zinc-200 dark:bg-zinc-800')} />)}</div>
            <p className="mt-1 text-xs text-zinc-500">Strength: {['Too short', 'Weak', 'Fair', 'Good', 'Strong'][s]}</p>
          </div>
          <Field label="Confirm new password" type="password" autoComplete="new-password" value={pw.conf} error={pwErr.conf} onChange={(e) => setPw({ ...pw, conf: e.target.value })} />
          <Button type="submit" variant="primary" className="w-full" disabled={!pwOk}>Update password</Button>
        </form>
      </Overlay>

      <Overlay open={qrOpen} onClose={() => setQrOpen(false)} title="Set up authenticator">
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">Scan this QR code with Google Authenticator, 1Password or Authy, then enter the 6-digit code.</p>
        <QrPreview />
        <p className="mt-3 text-center font-mono text-xs text-zinc-500">JBSW Y3DP EHPK 3PXP</p>
        <div className="mt-4"><Field label="6-digit code" inputMode="numeric" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} hint="Demo: any 6 digits will verify." /></div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setQrOpen(false)}><X size={14} /> Cancel</Button>
          <Button variant="primary" disabled={code.length !== 6} onClick={() => { setTwoFA(true); setQrOpen(false); toast('Two-factor authentication enabled'); }}><Check size={14} /> Verify & enable</Button>
        </div>
      </Overlay>
    </div>
  );
}
