class Alias extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "alias";
        this._desc = "Assigns or removes an alias for a discord user";
        this._syntax = config.global.prefix + this.commandname + " <@discord user> is/isn't <new alias>";
    }

   run() {
        return new Promise((resolve, reject) => {
            let theMatch = this.message.content.match(new RegExp("^" + config.global.prefix + "\\w+ (\\S+) (is|is not|isn't) (\\w+)", "mi"));
            if(this.theMatch.length > 3) {
                resolve(this.userAlias());
            } else {
                this.reply("can't assign an alias, command is missing parameters");
                reject(false);
            }
        });
    }

    getUserAlias(targetUser, theMatch) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM userAlias WHERE `userId` = ? AND `userAlias` = ?", [targetUser.id, theMatch[3]], (err, row) => {
                if(err !== null) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    insertAlias(targetUser, theMatch) {
        return new Promise((resolve, reject) => {
            let insertStatement = db.prepare("INSERT INTO userAlias (userId, userName, userDiscrim, userAlias) VALUES (?, ?, ?, ?);");
            insertStatement.run([targetUser.id, targetUser.username, targetUser.discriminator, theMatch[3]], (re) => {
                if(re !== '') {
                    this.error = "error in database exection during insert :" + re;
                    this.reply = "I'm sorry, but it seems like an error has occured";
                } else {
                    this.reply = "Understood, <@" + targetUser.id + "> is now " + theMatch[3];
                }
            });
        });
    }

    async userAlias(theMatch) {
        let users = this.message.mentions.users.array(),
            targetUser = '';
        for(let i = 0; i < users.length; i++) {
            let theRegexp = new RegExp("<@" + users[i].id + ">");
            if(theMatch[1].match(theRegexp)) {
                targetUser = users[i];
                break;
            }
        }
        this.getUserAlias(targetUser, theMatch)
            .then((result) => {
                if(theMatch[2] === "is" && theMatch[3] !== "not") {
                    if(result === '') {

                    } else {
                        this.reply = "that user alias already exists";
                        return true;
                    }

                }
            })
            .catch((err) => {
                    this.error = err;
                    this.reply = "sorry it seems like an error has occured";
                    return false;
            });
        if(theMatch[2] === "is" && theMatch[3] !== "not") {
            if(userInDb === '') {

            } else {
                this.reply = "that user alias already exists";
                return true;
            }

        } else if(theMatch[2] === "isn't" || (theMatch[2] === "is" && theMatch[3] === "not")) {
            if(userInDb !== '') {
                db.run("DELETE FROM userAlias WHERE id = ?", userInDb, (err) => {
                    if(err !== null) {
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
            } else {
                this.reply = "userAlias was not found in database"
            }
        } else {
            this.reply = "Error in the alias command, are you sure you wrote it correctly?"
        }
    }
}

commands.register(Alias, "alias");