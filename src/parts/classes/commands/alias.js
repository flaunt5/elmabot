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

    userAlias(message) {
        let theMatch = message.content.match(new RegExp("^" + config.global.prefix + "\\w+ (\\S+) (is|is not|isn't) (\\w+)", "mi"));
        if (theMatch.length > 4) {
            let users = message.mentions.users.array(),
                targetUser = '';
            for(let i = 0; i < users.length; i++) {
                let theRegexp = new RegExp("<@" + users[i].id + ">");
                if(match[1].match(theRegexp)) {
                    targetUser = users[i];
                    break;
                }
            }
            if(theMatch[2] === "is" && theMatch[3] !== "not") {
                console.log("attempting databaseInsert");
                let insertStatement = db.prepare("INSERT INTO userAlias (userId, userName, userDiscrim, userAlias) VALUES (?, ?, ?, ?);");
                insertStatement.run([targetUser.id, targetUser.username, targetUser.discriminator, theMatch[3]], (re) => {
                    if(re !== '') {
                        this.error = "error in database exection during insert :" + re;
                        this.reply = "I'm sorry, but it seems like an error has occured";
                        return false;
                    } else {
                        this.reply = "Understood, <@" + targetUser.id + "> is now " + theRest[3];
                        return true;
                    }
                });
            } else if(theMatch[2] === "isn't" || (theMatch[2] === "is" && theMatch[3] === "not")) {
                db.get("SELECT * FROM userAlias WHERE `userId` = ? AND `userAlias` = ?", [targetUser.id, theMatch[3]], (err, row) => {
                    if(error !== undefined) {
                        this.error = "error in database exection during lookup :" + err;
                        this.reply = "I'm sorry, but it seems like an error has occured";
                        return false;
                    } else if(row === undefined) {
                        console.log("row not found");
                        this.reply = "Alias was not found";
                        return true;
                    } else {
                        console.log("row :");
                        console.dir(row);
                        db.run("DELETE FROM userAlias WHERE id = ?", row.id, (err) => {
                            if(error !== null) {
                                console.log("error :");
                                console.log(err);
                                this.error = "error in database execution during deletion :" + err;
                                this.reply = "I'm sorry, but it seems like an error has occured";
                                return false;
                            } else {
                                console.log("worked");
                                this.reply = "Understood, <@" + targetUser.id + "> is no longer " + theMatch[3];
                                return true;
                            }
                        });
                    }
                });
            } else {
                this.reply = "Error in the alias command, are you sure you wrote it correctly?"
            }
        } else {
            this.reply = "I'm sorry but it seems like you haven't finished the alias command, please try again";
            return true;
        }
    }
}

commands.register(Alias, "alias");