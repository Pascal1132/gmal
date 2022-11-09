export const getRelativeTime = (time, full = true) => {
    const now = new Date();
    const date = new Date(time);
    const absoluteDate = new Date(time).setHours(0, 0, 0, 0);
    const diffDays = now.setHours(0, 0, 0, 0) - absoluteDate;
    // if minutes is less than 10, add a 0
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    // if the date is not today
    if (diffDays == 0) {
        return full ? `Aujourd'hui à ${date.getHours()}:${minutes}`: `${date.getHours()}:${minutes}`;
    }
    // if it is the same week, show day like Mon
    if (diffDays < 7) {
        return full ? getDay(date) + " à " + date.getHours() + ":" + minutes : getDay(date);
    }
    // if it is the same year, show date like Oct 20
    if (date.getFullYear() === now.getFullYear()) {
        return full ? `${date.getDate()} ${getMonth(date)} à ${date.getHours()}:${minutes}` : `${date.getDate()} ${getMonth(date)}`;
    }

    // if it is not the same year, show date like 20 Oct 2019 à 12:00
    return full ? `${date.getDate()} ${getMonth(date)} ${date.getFullYear()} à ${date.getHours()}:${minutes}` : `${date.getDate()} ${getMonth(date)} ${date.getFullYear()}`;
};

export const getDay = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

export const getMonth = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}