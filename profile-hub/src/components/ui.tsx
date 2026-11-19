import { useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Card({ children, className, title, action, id }: { children: ReactNode; className?: string; title?: string; action?: ReactNode; id?: string }) {
  return (
    <section id={id} aria-label={title} className={cx('glass rounded-card p-5 sm:p-6', className)}>
      {title && (
        <header className="mb-4 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"><span className="h-3.5 w-1 rounded-full bg-gradient-to-b from-accent to-pink-500" aria-hidden />{title}</h3>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' };
export function Button({ variant = 'secondary', size = 'md', className, ...p }: BtnProps) {
  const v = {
    primary: 'btn-glow text-accent-fg hover:brightness-110 border border-transparent',
    secondary: 'border border-zinc-200/80 bg-white/70 text-zinc-800 backdrop-blur hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10',
    ghost: 'border border-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
    danger: 'border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950',
  }[variant];
  return (
    <button {...p} className={cx('inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50',
      size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm', v, className)} />
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'btn-glow' : 'bg-zinc-300 dark:bg-zinc-700')}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow', checked ? 'right-0.5' : 'left-0.5')} />
    </button>
  );
}

export function Field({ label, error, hint, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</label>
      <input id={id} {...p} aria-invalid={!!error} aria-describedby={error || hint ? id + '-d' : undefined}
        className={cx('w-full rounded-xl border bg-white/80 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-600 dark:bg-black/30 dark:text-zinc-100 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-400',
          error ? 'border-red-400 dark:border-red-700' : 'border-zinc-200 focus:border-accent dark:border-white/10')} />
      {(error || hint) && <p id={id + '-d'} className={cx('mt-1 text-xs', error ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400')}>{error || hint}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800', className)} />;
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'green' | 'amber' }) {
  const t = {
    neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    accent: 'bg-accent/10 text-accent',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  }[tone];
  return <span className={cx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', t)}>{children}</span>;
}

/** Modal (center) or Drawer (right) with focus trap, ESC close and scroll lock. */
export function Overlay({ open, onClose, title, children, side = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-zinc-950/55 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
            initial={side ? { x: '100%' } : { opacity: 0, y: 16, scale: 0.97 }} animate={side ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }} exit={side ? { x: '100%' } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className={cx('absolute overflow-y-auto glass !bg-white/90 p-6 shadow-2xl dark:!bg-zinc-900/90',
              side ? 'right-0 top-0 h-full w-full max-w-md border-y-0 border-r-0' : 'inset-x-4 top-[10vh] mx-auto max-h-[80vh] max-w-md rounded-card')}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={16} /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
