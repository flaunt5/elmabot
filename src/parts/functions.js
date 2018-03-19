/**
 * Just a basic helper function to return the current date and time as a string, formatted in a way I like
 * @returns {string}
 */
function getCurrentDatetime() {
    let today = new Date(),
        todayDay = today.getDate(),
        todayMonth = today.getMonth() + 1,
        todayYear = today.getFullYear(),
        todayHour = today.getHours(),
        todayMinutes = today.getMinutes(),
        todaySeconds = today.getSeconds();

    if(todayMonth < 10) {
        todayMonth = "0" + todayMonth;
    }
    if(todayDay < 10) {
        todayDay = "0" + todayDay;
    }

    return todayYear + "-" + todayMonth + "-" + todayDay + " " + todayHour + ":" + todayMinutes + ":" + todaySeconds;
}

/**
 * checks whether or not a discord user has a nickname or not
 * if not, returns the user's discord username
 * @param member - a discordjs member object
 * @returns {string} - either the nickname or username
 */
function theNick(member) {
    if(member.nickname === null) {
        return member.user.username;
    } else {
        return member.nickname;
    }
}