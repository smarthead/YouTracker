export default (seconds) => {
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    minutes %= 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} ч ${minutes} мин`;
    } else if (hours > 0) {
        return `${hours} ч`;
    } else {
        return `${minutes} мин`;
    }
};
