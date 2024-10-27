export function formatTimeSpan(timeString) {
    // timeString is seconds
    if (!timeString) {
        return '00:00:00';
    }

    let hours = Math.floor(timeString / 3600);
    let minutes = Math.floor((timeString - (hours * 3600)) / 60);
    let seconds = timeString - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}