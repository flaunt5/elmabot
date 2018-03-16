class Alias extends Ecommand {
    constructor(message) {
        super(message);
    }

    /**
     * re-analyzes the message and creates/stores an alias for a user
     * Also checks if an alias exists and associates it with the user
     * @param {Collection} message - a discordjs message object
     * @returns {string} - just returns the string to serve as answer for now, because I'm lazy and sloppy
     */

    userAlias(message) {
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
                this.reply = theMatch[2];
            } else {
                this.reply = "I'm sorry, but it seems like you didn't finish your alias command 😦";
            }
        } else {
            this.reply = "I'm sorry, it seems like I couldn't understand the alias command 😦";
        }
    }
}

commands.register(Alias, "alias");