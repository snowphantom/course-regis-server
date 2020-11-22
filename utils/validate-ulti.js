module.exports.validateUsername = (text) => {
    let trimedText = text.trim();
    if (trimedText.length < 4) return false; 
    return true;
}

module.exports.validatePassword = (text) => {
    let trimmedText = text.trim();
    if (trimmedText.length < 4) return false;
    return true;
}