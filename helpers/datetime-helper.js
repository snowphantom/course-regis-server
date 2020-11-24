const DayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const getHour = (content) => {
    const data = content && content.split(':');
    return parseInt(data[0]);
}

const getMinute = (content) => {
    const data = content && content.split(':');
    return parseInt(data[1]);
}

const checkConflictTime = (item_1, item_2) => {
    const time_1 = {
        start_time: new Date(0,0,0,getHour(item_1.start_time), getMinute(item_1.start_time)),
        end_time: new Date(0,0,0,getHour(item_1.end_time), getMinute(item_1.end_time))
    };
    const time_2 = {
        start_time: new Date(0,0,0,getHour(item_2.start_time), getMinute(item_2.start_time)),
        end_time: new Date(0,0,0,getHour(item_2.end_time), getMinute(item_2.end_time))
    };

    if (time_1.start_time < time_2.start_time) {
        return checkStartTime(time_1, time_2);
    } else {
        return checkStartTime(time_2, time_1);
    }
};

const checkStartTime = (smaller, larger) => {
    const duration_smaller = smaller.end_time - smaller.start_time;
    const duration_larger = larger.end_time - smaller.start_time;

    return smaller.end_time >= larger.start_time;
}

module.exports = {
    DayOfWeek,
    getHour,
    getMinute,
    checkConflictTime,
}