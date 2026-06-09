import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-CM', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function formatTime(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat('en-CM', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str;
}
