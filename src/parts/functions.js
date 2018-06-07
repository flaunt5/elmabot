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

    if(todayHour < 10) {
        todayHour = "0" + todayHour;
    }
    if(todayMinutes < 10) {
        todayMinutes = "0" + todayMinutes;
    }
    if(todaySeconds < 10) {
        todaySeconds = "0" + todaySeconds;
    }
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

function gibMarkov(input) {
    if(typeof input !== "string") return false;
    const Markov = new MarkovChain(fs.readFileSync("./res/markov/acidk.txt", "utf8"));
    let len = Math.random() * (35 - 3) + 3,
        chance = Math.floor(Math.random() * 100),
        split = input.split(" ");
    if(split.length > 2) {
        let ran = Math.floor(Math.random() * split.length);
        input = split[ran];
    }
    if(chance < 40) {
        let set = Math.random() * (len - 1) + 1,
            remain = len - set,
            result = Markov.end(set).process();
            result = result + " " + Markov.start(input).end(remain).process();
            return result;

    } else {
        return Markov.start(input).end(len).process();
    }

}