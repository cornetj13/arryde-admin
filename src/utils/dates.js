/*
  Shared date helpers for the admin dashboard.

  The API sends timestamps in TWO different shapes:
    - `DateTime` scalar (createdAt, updatedAt, canceledAt, completedAt,
      expiredAt) → ISO 8601 STRING, e.g. "2026-07-04T15:30:00.000Z"
    - `Long` scalar (driverNextAvailableAt, waitingStartedAt) → epoch
      MILLISECONDS as a number

  Running parseInt() on an ISO string yields just the year ("2026-07-04…"
  → 2026), and `new Date(2026)` is 2026ms after the epoch — which is why
  every date rendered as Dec 31, 1969. toDate() handles both shapes.
*/

// Normalize either shape into a Date, or null when unusable.
export const toDate = (value) => {
  if (value === null || value === undefined || value === '') return null;

  // Epoch milliseconds (number, or an all-digit string)
  if (typeof value === 'number' || /^\d+$/.test(String(value).trim())) {
    const ms = Number(value);
    if (!Number.isFinite(ms)) return null;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // ISO 8601 string (or anything else Date can parse)
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Epoch milliseconds from either shape, or null.
export const toMillis = (value) => {
  const d = toDate(value);
  return d ? d.getTime() : null;
};

// "July 4, 2026"
export const formatDate = (value) => {
  const d = toDate(value);
  if (!d) return 'N/A';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// "Jul 4, 2026, 3:30 PM"
export const formatDateTime = (value) => {
  const d = toDate(value);
  if (!d) return 'N/A';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// "Jul 4, 3:30 PM" — compact form for table cells
export const formatShortDateTime = (value) => {
  const d = toDate(value);
  if (!d) return 'N/A';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Human-readable countdown for a driver's next-available time.
export const formatNextAvailable = (value) => {
  const availableTime = toMillis(value);
  if (!availableTime) return 'Available Now';

  const now = Date.now();
  if (availableTime <= now) return 'Available Now';

  const diffMins = Math.floor((availableTime - now) / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Available Now';
  if (diffMins < 60) return `In ${diffMins} minute${diffMins === 1 ? '' : 's'}`;
  if (diffHours < 24) {
    const remainingMins = diffMins % 60;
    return remainingMins > 0
      ? `In ${diffHours}h ${remainingMins}m`
      : `In ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
  }

  return new Date(availableTime).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
  });
};

// Elapsed minutes since a rider started waiting.
export const minutesSince = (value) => {
  const started = toMillis(value);
  if (!started) return null;
  return Math.floor((Date.now() - started) / 60000);
};
