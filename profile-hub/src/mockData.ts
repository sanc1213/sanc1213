import type { Activity, Invoice, Metric, NotifRow, Pinned, Profile, Session } from './types';

export const initialProfile: Profile = {
  name: 'Sanchit Singh', handle: 'sanc1213', headline: 'B.Tech CSE · Full-Stack Developer · AI/ML enthusiast',
  location: 'India', timezone: 'Asia/Kolkata', email: 'sanchit.sin123@gmail.com', phone: '+91 98765 43210',
  website: 'https://github.com/sanc1213',
  bio: 'Building practical software, one commit at a time. I like turning ideas into working applications — from PHP/MySQL and JSP/AJAX web apps to data-mining projects on real election data. Currently exploring React, TypeScript and applied machine learning.',
  skills: ['React', 'TypeScript', 'Node.js', 'PHP', 'MySQL', 'JSP', 'AJAX', 'Python', 'Pandas', 'Data Mining', 'Tailwind CSS', 'Git'],
  languages: ['English', 'Hindi'],
  links: [
    { label: 'GitHub', url: 'https://github.com/sanc1213', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sanchit3/', icon: 'linkedin' },
    { label: 'LeetCode', url: 'https://leetcode.com/u/LuxurySoldier42395/', icon: 'code' },
    { label: 'Portfolio', url: 'https://github.com/sanc1213', icon: 'globe' },
  ],
  verified: true, status: 'online',
};

export const coverGradients = [
  'linear-gradient(120deg,#4f46e5,#9333ea 45%,#ec4899 80%,#f59e0b)',
  'linear-gradient(120deg,#0f0c29,#302b63,#24243e)',
  'linear-gradient(120deg,#f97316,#ec4899,#8b5cf6)',
  'linear-gradient(120deg,#06b6d4,#3b82f6,#6366f1)',
  'linear-gradient(120deg,#10b981,#14b8a6,#0ea5e9)',
  'linear-gradient(120deg,#18181b,#3f3f46,#71717a)',
  'linear-gradient(120deg,#fde68a,#fca5a5,#c4b5fd)',
];

export const metrics: Metric[] = [
  { label: 'Projects Shipped', value: '24', trend: 12, hint: 'vs last quarter' },
  { label: 'Contributions', value: '1,482', trend: 8.4, hint: 'last 12 months' },
  { label: 'Reputation Score', value: '4,920', trend: 3.1, hint: 'community points' },
  { label: 'Completion Rate', value: '96%', trend: -1.2, hint: 'assignments on time' },
];

export const activities: Activity[] = [
  { id: 'a1', kind: 'project', title: 'Merged “GE 2024 results clustering”', detail: 'data-mining-assignment · +482 −37', time: '2h ago' },
  { id: 'a2', kind: 'review', title: 'Reviewed PR #58 in web-tech-lab', detail: 'Requested changes on SQL prepared statements', time: '5h ago' },
  { id: 'a3', kind: 'system', title: 'Signed in from new device', detail: 'Chrome on Windows · Delhi, IN', time: 'Yesterday' },
  { id: 'a4', kind: 'project', title: 'Published release v1.3.0 of AJAX-dashboard', detail: 'Live server data with JSP + AJAX polling', time: '2d ago' },
  { id: 'a5', kind: 'review', title: 'Commented on “Apriori vs FP-Growth”', detail: 'Added runtime comparison table', time: '3d ago' },
  { id: 'a6', kind: 'system', title: 'Two-factor authentication reminder', detail: 'Enable 2FA to secure your account', time: '4d ago' },
  { id: 'a7', kind: 'project', title: 'Created repository profile-hub', detail: 'React + TypeScript + Tailwind', time: '1w ago' },
];

export const pinned: Pinned[] = [
  { id: 'p1', title: 'GE 2024 Election Insights', description: 'Clustering and association mining on Lok Sabha 2024 constituency results.', tags: ['Python', 'Pandas', 'KMeans'], gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', url: 'https://github.com/sanc1213' },
  { id: 'p2', title: 'Dynamic Web Apps', description: 'PHP/MySQL and JSP/AJAX apps fetching and rendering server data live.', tags: ['PHP', 'MySQL', 'JSP', 'AJAX'], gradient: 'linear-gradient(135deg,#f97316,#ec4899)', url: 'https://github.com/sanc1213' },
  { id: 'p3', title: 'Profile Hub', description: 'This account hub: bento layout, themes, security and billing flows.', tags: ['React', 'TypeScript', 'Framer Motion'], gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)', url: 'https://github.com/sanc1213' },
];

export const initialSessions: Session[] = [
  { id: 's1', device: 'Windows Laptop', browser: 'Chrome 131', ip: '103.21.58.14', location: 'Delhi, IN', last: 'Active now', current: true, kind: 'desktop' },
  { id: 's2', device: 'Pixel 8', browser: 'Chrome Mobile', ip: '152.58.201.7', location: 'Noida, IN', last: '3 hours ago', current: false, kind: 'phone' },
  { id: 's3', device: 'MacBook Air', browser: 'Safari 17', ip: '49.36.112.90', location: 'Pune, IN', last: '2 days ago', current: false, kind: 'desktop' },
  { id: 's4', device: 'Lab PC-17', browser: 'Firefox 132', ip: '10.14.0.77', location: 'Campus network', last: '6 days ago', current: false, kind: 'desktop' },
];

export const initialNotifs: NotifRow[] = [
  { id: 'mentions', label: 'Mentions & replies', desc: 'When someone @mentions you or replies to your comments.', email: true, push: true, inapp: true },
  { id: 'security', label: 'Security alerts', desc: 'New sign-ins, password changes and 2FA events.', email: true, push: true, inapp: true },
  { id: 'digest', label: 'Weekly digest', desc: 'A summary of your activity and recommendations.', email: true, push: false, inapp: false },
  { id: 'reviews', label: 'Review requests', desc: 'When you are asked to review a project or pull request.', email: false, push: true, inapp: true },
];

export const accents = [
  { name: 'Indigo', rgb: '99 102 241' }, { name: 'Violet', rgb: '139 92 246' }, { name: 'Rose', rgb: '244 63 94' },
  { name: 'Emerald', rgb: '16 185 129' }, { name: 'Amber', rgb: '217 119 6' }, { name: 'Sky', rgb: '2 132 199' },
];

export const invoices: Invoice[] = [
  { id: 'INV-2026-011', date: 'Nov 1, 2026', amount: '$12.00', status: 'Paid' },
  { id: 'INV-2026-010', date: 'Oct 1, 2026', amount: '$12.00', status: 'Paid' },
  { id: 'INV-2026-009', date: 'Sep 1, 2026', amount: '$12.00', status: 'Paid' },
  { id: 'INV-2026-008', date: 'Aug 1, 2026', amount: '$12.00', status: 'Paid' },
];

/** Deterministic pseudo-random heatmap: 53 weeks x 7 days of levels 0-4. */
export function buildHeatmap(): number[][] {
  let seed = 42;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: 53 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const r = rnd() * (d === 0 || d === 6 ? 0.7 : 1) * (0.55 + (w / 53) * 0.6);
      return r < 0.3 ? 0 : r < 0.5 ? 1 : r < 0.7 ? 2 : r < 0.85 ? 3 : 4;
    }),
  );
}
