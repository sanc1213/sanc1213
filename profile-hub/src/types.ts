export type TabId = 'overview' | 'security' | 'preferences' | 'billing';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ActivityKind = 'project' | 'review' | 'system';
export interface Profile {
  name: string; handle: string; headline: string; location: string; timezone: string;
  email: string; phone: string; website: string; bio: string; skills: string[]; languages: string[];
  links: { label: string; url: string; icon: 'github' | 'linkedin' | 'code' | 'globe' }[];
  verified: boolean; status: 'online' | 'away' | 'busy' | 'offline';
}
export interface Activity { id: string; kind: ActivityKind; title: string; detail: string; time: string }
export interface Metric { label: string; value: string; trend: number; hint: string }
export interface Pinned { id: string; title: string; description: string; tags: string[]; gradient: string; url: string }
export interface Session { id: string; device: string; browser: string; ip: string; location: string; last: string; current: boolean; kind: 'desktop' | 'phone' }
export interface Invoice { id: string; date: string; amount: string; status: 'Paid' | 'Pending' }
export type Channel = 'email' | 'push' | 'inapp';
export interface NotifRow { id: string; label: string; desc: string; email: boolean; push: boolean; inapp: boolean }
