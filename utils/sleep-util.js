module.exports.sleep = (periodMs) => {
    return new Promise(r => setTimeout(r, periodMs));
}