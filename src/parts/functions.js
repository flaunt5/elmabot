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

function getPrefix(server) {
    if(settings.general[server]['commandprefix'] == false || settings.general[server]['commandprefix'] == undefined) {
        return config.global.prefix;
    } else {
        return settings.general[server]['commandprefix'];
    }
}

function getPrefixRegex(server) {
        return new RegExp("^" + getPrefix(server) + "(\\w+) ?(.*)?", "mi");
}

function getMarkovData(file) {
    try {
        let data = fs.readFileSync("./res/markov/" + file + ".txt", "utf8");
        return data.split("\n");
    }
    catch (e) {
        logger.error("error while trying to open file for markov : " + JSON.stringify(e));
        return false;
    }
}

// console.dir(getMarkovData(config.global.markov).length);
//
// const Markov = new MarkovStrings(getMarkovData(config.global.markov));
// Markov.buildCorpusSync();
// const result = Markov.generateSentenceSync({filter: result => {
//     if(result.refs.length < 2) return false; else return true;
//     }});
// console.log(result);

function gibMarkov(input, server) {
    return new Promise((resolve, reject) => {
        if(typeof input !== "string" || typeof server !== "string") reject(false);

        input = input.replace(new RegExp("[.,\\/#!?$%\\^&\\*;:{}=\\-_`~()\\[\\]]", "i"), "");
        try { file = fs.readFileSync("./res/markov/" + server + ".txt", "utf8"); }
        catch (e) {
            logger.error("error while trying to open file for markov : " + e.toString());
            reject(false);
        }

        let len = Math.floor(Math.random() * (50 - 3) + 3),
            chance = Math.floor(Math.random() * 100),
            split = input.split(" ");

        if(split.length > 2) {
            let ran = Math.floor(Math.random() * split.length);
            input = split[ran];
        }

        if(chance < 60) {
            let set = Math.floor(Math.random() * (len - 1) + 1),
                remain = len - set,
                result = Markov.end(set).process();
            result = result + " " + Markov.start(input).end(remain).process();
            resolve(result);
        } else {
            resolve(Markov.start(input).end(len).process());
        }
    });
}

function makeMarkov(input, server) {

}