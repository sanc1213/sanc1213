import { useState } from 'react';
import { ChevronDown, CreditCard, Download, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { invoices } from '../mockData';
import { Badge, Button, Card, Skeleton, cx } from './ui';
import { useLoading } from '../hooks/useLoading';
import { useToast } from '../hooks/useToast';

const usage = [{ label: 'Storage', used: 6.4, max: 10, unit: 'GB' }, { label: 'API calls', used: 41200, max: 50000, unit: '' }, { label: 'Team seats', used: 2, max: 5, unit: '' }];

export function BillingTab({ readOnly }: { readOnly: boolean }) {
  const loading = useLoading('billing');
  const toast = useToast();
  const [open, setOpen] = useState(true);
  const [plan, setPlan] = useState<'Pro' | 'Team'>('Pro');

  const download = (id: string) => {
    const blob = new Blob([`Invoice ${id}\nPlan: ${plan}\nStatus: Paid\n`], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${id}.txt`; a.click(); URL.revokeObjectURL(a.href);
    toast(`Downloaded ${id}`);
  };

  if (loading) return <Skeleton className="h-96" />;
  return (
    <Card>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between rounded-lg text-left">
        <span className="flex items-center gap-2 text-sm font-semibold">Billing & plan <Badge tone="accent"><Sparkles size={11} /> {plan}</Badge></span>
        <ChevronDown size={16} className={cx('transition', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid gap-4 pt-5 lg:grid-cols-3">
              <div className="rounded-card border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Current plan</p>
                <p className="mt-1 text-2xl font-semibold">{plan} <span className="text-sm font-normal text-zinc-500">{plan === 'Pro' ? '$12' : '$29'}/mo</span></p>
                <p className="mt-1 text-xs text-zinc-500">Renews Dec 1, 2026</p>
                <Button className="mt-4 w-full" variant="primary" disabled={readOnly} onClick={() => { const n = plan === 'Pro' ? 'Team' : 'Pro'; setPlan(n); toast(`Switched to ${n} plan`); }}>{plan === 'Pro' ? 'Upgrade to Team' : 'Downgrade to Pro'}</Button>
              </div>
              <div className="space-y-4 rounded-card border border-zinc-200 p-4 dark:border-zinc-800">
                {usage.map((u) => {
                  const mult = plan === 'Team' ? 2 : 1; const max = u.max * mult; const pct = Math.round((u.used / max) * 100);
                  return (
                    <div key={u.label}>
                      <div className="mb-1 flex justify-between text-xs"><span className="font-medium">{u.label}</span><span className="text-zinc-500">{u.used.toLocaleString()} / {max.toLocaleString()} {u.unit}</span></div>
                      <div role="progressbar" aria-label={u.label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <motion.div className={cx('h-full rounded-full', pct > 80 ? 'bg-amber-500' : 'bg-accent')} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-card border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Payment method</p>
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 text-white">
                  <CreditCard size={22} aria-hidden /><div><p className="font-mono text-sm tracking-wider">•••• •••• •••• 4242</p><p className="text-xs text-zinc-400">Visa · Expires 08/28</p></div>
                </div>
                <Button className="mt-3 w-full" disabled={readOnly} onClick={() => toast('Payment method editor opened', 'info')}>Update card</Button>
              </div>
            </div>
            <div className="-mx-5 mt-5 overflow-x-auto px-5">
              <table className="w-full min-w-[480px] text-left text-sm">
                <caption className="sr-only">Invoice history</caption>
                <thead><tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800"><th className="pb-2 font-medium">Invoice</th><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Amount</th><th className="pb-2 font-medium">Status</th><th className="pb-2"><span className="sr-only">Download</span></th></tr></thead>
                <tbody>{invoices.map((i) => (
                  <tr key={i.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                    <td className="py-3 font-mono text-xs">{i.id}</td><td className="py-3 text-zinc-600 dark:text-zinc-400">{i.date}</td><td className="py-3">{i.amount}</td>
                    <td className="py-3"><Badge tone={i.status === 'Paid' ? 'green' : 'amber'}>{i.status}</Badge></td>
                    <td className="py-3 text-right"><Button size="sm" variant="ghost" aria-label={`Download ${i.id}`} onClick={() => download(i.id)}><Download size={14} /> PDF</Button></td>
                  </tr>))}</tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
