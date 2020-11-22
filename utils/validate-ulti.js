module.exports.validateUsername = (text) => {
    let trimedText = text && text.trim() || "";
    if (trimedText.length < 4) return false; 
    return true;
}

module.exports.validatePassword = (text) => {
    let trimmedText = text && text.trim();
    if (trimmedText.length < 4) return false;
    return true;
}