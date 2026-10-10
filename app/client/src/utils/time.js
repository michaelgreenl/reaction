export function formatDate(isoString) {
    const date = new Date(isoString);
    if (isNaN(date)) throw new Error('Invalid ISO date string');

    const parts = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type)?.value;

    const hour = get('hour');
    const minute = get('minute');
    const ampm = get('dayPeriod')?.toLowerCase();
    const month = get('month')?.slice(0, 3);
    const day = get('day');
    const year = get('year');

    const now = new Date();
    const sameDay =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();

    return sameDay ? `${hour}:${minute}${ampm}` : `${month} ${day}, ${year}`;
}

export function formatTime(timeMs) {
    let seconds = (timeMs / 1000).toFixed(2);

    if (seconds < 59.99) {
        return `${seconds}s`;
    } else {
        const mins = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        if (seconds >= 10) {
            return `${mins}:${seconds}`;
        } else {
            return `${mins}:0${seconds}`;
        }
    }
}

export function getTimePassed(pastTime) {
    const pastDate = new Date(pastTime);
    const now = new Date();
    const diff = now - pastDate;

    if (diff < 0) {
        return;
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds === 0) return 'just now';
    return `${seconds}s ago`;
}
