const time: Date = new Date();

function fullDate() {
    let fullDate: string = time.toISOString().slice(0, 10);
    return fullDate;
}

function timestamp() {
    let timestamp: string = time.toISOString().slice(11, 13) + time.toISOString().slice(14, 16) + time.toISOString().slice(17, 19);
    return timestamp;
}

export { time, fullDate, timestamp };