class Alias extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "alias";
        this._desc = "Assigns or removes an alias for a discord user";
        this._syntax = config.global.prefix + this.commandname + " <@discord user> is/isn't <new alias>";
    }

    run() {
        if(this.params !== undefined && this.params.length > 2) {
            return this.userAlias(this.message);
        } else {
            this.reply("can't assign an alias, command is missing parameters");
            return false
        }
    }

    /**
     * re-analyzes the message and creates/stores an alias for a user
     * Also checks if an alias exists and associates it with the user
     * @param {Collection} message - a discordjs message object
     * @returns {string} - just returns the string to serve as answer for now, because I'm lazy and sloppy
     */
    userAlias(message) {
        let params = this.params;
        let regex = new RegExp("^(\\w+) (is|is not|isn't) (\\w+)", "mi"),
            theMatch = message.content.match(prefix),
            theRest = theMatch[2].match(regex);
        console.dir(params);
        console.dir(theMatch);
        console.dir(theRest);
        return false;
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