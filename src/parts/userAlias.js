/**
 * re-analyzes the message and creates/stores an alias for a user
 * Also checks if an alias exists and associates it with the user
 * @param {Collection} message - a discordjs message object
 * @returns {string} - just returns the string to serve as answer for now, because I'm lazy and sloppy
 */
function userAlias(message) {
    let regex = new RegExp("^e&(\\w+) (\\S*) (is not|isn't|is) (\\w*)", "im"),
        theMatch = message.content.match(regex);
    if (theMatch !== null) {
        if (theMatch.length > 3) {
            let users = message.mentions.users.array(),
                targetUser = '';
            for(let i = 0; i < users.length; i++) {
                let theRegexp = new RegExp("<@" + users[i].id + ">");
                if(theMatch[2].match(theRegexp)) {
                    targetUser = users[i];
                    break;
                }
            }
            console.dir(targetUser);
            console.log("attempting databaseInsert");
            let insertStatement = db.prepare("INSERT INTO userAlias (userId, userName, userDiscrim, userAlias) VALUES (?, ?, ?, ?);");
            insertStatement.run([targetUser.id, targetUser.username, targetUser.discriminator, theMatch[4]], function (re) {
                console.dir(re);
                console.dir(this);
            });
            insertStatement.finalize();
            return theMatch[2];
        } else {
            return "I'm sorry, but it seems like you didn't finish your alias command 😦";
        }
    } else {
        return "I'm sorry, it seems like I couldn't understand the alias command 😦";
    }
}

/**
 *
 * @param {string} content - the content of the message in string for you
 * @returns {string} the content of the message with all aliases replaced
 */
function findUserAlias(content) {
    db.each("SELECT userAlias AS alias FROM userAlias", function(error, row) {
            let match = content.match(row.alias);
            if(match) {
                console.log(match[0]);
                content.replace(match[0], userReplace)
            }
        });
    return content;
}