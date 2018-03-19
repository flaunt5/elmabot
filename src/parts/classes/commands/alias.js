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
        if (theRest.length > 3) {
            let users = message.mentions.users.array(),
                targetUser = '';
            for(let i = 0; i < users.length; i++) {
                let theRegexp = new RegExp("<@" + users[i].id + ">");
                if(theRest[0].match(theRegexp)) {
                    targetUser = users[i];
                    break;
                }
            }
            console.dir(targetUser);
            let rep = '',
                err = '';
            if(theRest[1] === "is") {
                console.log("attempting databaseInsert");
                let insertStatement = db.prepare("INSERT INTO userAlias (userId, userName, userDiscrim, userAlias) VALUES (?, ?, ?, ?);");
                insertStatement.run([targetUser.id, targetUser.username, targetUser.discriminator, theRest[3]], function (re) {
                    err = "error in database exection during insert :" + re;
                });
                if(err !== '') {
                    this.reply = "I'm sorry, but it seems like an error has occured";
                    return false;
                } else {
                    insertStatement.finalize();
                    this.reply = "Understood, <@" + targetUser.id + "> is now " + theRest[3];
                    return true;
                }
            } else {
                console.log("attempting database removal");
                db.get("SELECT id FROM userAlias WHERE userId = ? AND userAlias = ?", [targetUser.id, theRest[3]], function(error, row) {
                    if(error !== undefined) {
                        err = "error in database exection during lookup :" + error;
                        rep = "I'm sorry, but it seems like an error has occured";
                    }
                    if(row === undefined) {
                       rep = "Alias was not found";
                       return true;
                    } else {
                        db.run("DELETE FROM userAlias WHERE id = ?", row,id, function(error) {
                            if(error !== null) {
                                err = "error in database execution during deletion :" + error;
                                rep = "I'm sorry, but it seems like an error has occured";
                            } else {
                                rep = "Undertood, <@" + targetUser.id + "> is no longer " + theRest[3];
                            }
                        });
                    }
                });
                this.reply = rep;
                if(err !== '') {
                    this.error = err;
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            this.reply = "I'm sorry but it seems like you haven't finished the alias command, please try again";
            return true;
        }
    }
}

commands.register(Alias, "alias");