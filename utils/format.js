// Tiny formatting helpers shared across the UI.

export const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

// "06:30" -> "6:30 AM"
export function formatTime(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const ampm = h < 12 ? 'AM' : 'PM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

// 450 -> "7h 30m"
export function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h${m ? ` ${m}m` : ''}`;
}

// Add minutes to a "HH:mm" time. Returns { time, dayOffset } where dayOffset
// is how many days later the result lands on (for overnight buses).
export function addMinutes(hhmm, mins) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const total = h * 60 + m + mins;
  const dayOffset = Math.floor(total / 1440);
  const t = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(t / 60)).padStart(2, '0');
  const mm = String(t % 60).padStart(2, '0');
  return { time: `${hh}:${mm}`, dayOffset };
}

// "2026-07-02" -> "Thu, 2 Jul"
export function formatDateLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
