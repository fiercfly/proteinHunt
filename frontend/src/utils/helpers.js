// Indian number format: ₹1,24,999
export function formatPrice(price) {
  if (price == null || price === '') return null;
  return '₹' + Number(price).toLocaleString('en-IN');
}

// Savings amount
export function savings(original, current) {
  if (!original || !current || original <= current) return null;
  return formatPrice(original - current);
}

// Relative time: "3m ago", "2h ago", "yesterday"
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'yesterday';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Is a deal "new" (posted in last 2 hours)?
export function isNew(dateStr) {
  return Date.now() - new Date(dateStr).getTime() < 2 * 60 * 60 * 1000;
}

// Is a deal about to expire?
export function isExpiringSoon(expiresAt) {
  if (!expiresAt) return false;
  const remaining = new Date(expiresAt).getTime() - Date.now();
  return remaining > 0 && remaining < 3 * 60 * 60 * 1000; // < 3 hours
}

// Debounce
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Truncate text
export function truncate(str, n) {
  if (!str || str.length <= n) return str;
  return str.slice(0, n).trim() + '…';
}