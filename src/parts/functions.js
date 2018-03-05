//TODO check if a switch statement is really the best way, maybe an array with corresponding functions is better?
/**
 * switch statement to call individual commands
 * @param {string} command - the regex of the command to pass
 * @param {Collection} message - the Discordjs message object
 * @param {Collection} user - the Discordjs user object
 * @returns {string} = returns whatever the command function returns as a string
 */
function baseMessageCommands(command, message, user) {
    let returnVal = '';
    switch (command) {
        case "alias":
            returnVal = userAlias(message, user);
            break;
        case "commands":
            returnVal = "```" + commandList + "```";
            break;
        default:
            returnVal = false;
            break;
    }
    return returnVal;
}

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
 * Wrapper function to perform searches for mentions and aliases
 * @param {object} message - a discordjs message object
 * @param {string} content - the content of the message as a string
 * @returns {string|*} the message, parsed and with all mentions and aliases replaced
 */
function parseMessage(message, content) {
    let users = message.mentions.users.array(),
        roles = message.mentions.roles.array();

    content = findUserAlias(content);

    if(users.length > 0) {
        content = replaceMentionsUsers(users, content);
    }
    if(roles.length > 0) {
        content = replaceMentionsRoles(roles, content);
    }
    return content;
}

/**
 * General function to replace user mentions with a predefined alternative
 * @param {object} users - a discordjs collection of user mentions in a message
 * @param {string} content - the message as a string
 * @returns {string} the message with all user mentions replaced
 */
function replaceMentionsUsers(users, content) {
    let result;
    for(let i = 0, len = users.length; i < len; i++) {
        let regex = new RegExp("<@" + users[i].id + ">", "g");

        result = content.replace(regex, userReplace);
    }
    return result;
}

//TODO should fold this and replaceMentionsUsers into a single function
/**
 * General function to replace role mentions with a predefined alternative
 * @param {object} roles - a discordjs collection of role mentions in a message
 * @param {string} content - the message as a string
 * @returns {string} the message with all role mentions replaced
 */
function replaceMentionsRoles(roles, content) {
    let result;
    for(let i = 0, len = roles.length; i < len; i++) {
        let regex = new RegExp("<@&" + roles[i].id + ">", "g");

        result = content.replace(regex, rolesReplace);
    }
    return result;
}

