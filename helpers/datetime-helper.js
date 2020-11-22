const DayOfWeek = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0
};

const getHour = (content) => {
    const data = content.split(':');
    return parseInt(data[0]);
}

const getMinute = (content) => {
    const data = content.split(':');
    return parseInt(data[1]);
}

module.exports = {
    DayOfWeek,
    getHour,
    getMinute,

}