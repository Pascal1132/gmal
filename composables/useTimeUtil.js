export const getRelativeTime = (time) => {
    const now = new Date();
    const date = new Date(time);
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));
    const diffHours = Math.floor(diff / (1000 * 3600));
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffSeconds = Math.floor(diff / (1000));
    // if minutes is less than 10, add a 0
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    // if it is today, show time like 12:00
    if (diffDays === 0) {
        return `${date.getHours()}:${minutes}`;
    }
    // if it is the same week, show day like Mon
    if (diffDays < 7) {
        return getDay(date);
    }
    // if it is the same year, show date like Oct 20
    if (date.getFullYear() === now.getFullYear()) {
        return `${getMonth(date)} ${date.getDate()}`;
    }

    // otherwise show date like Oct 20, 2020
    return `${getMonth(date)} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getDay = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

export const getMonth = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}