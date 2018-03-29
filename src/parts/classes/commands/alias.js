class Alias extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "alias";
        this._desc = "Assigns or removes an alias for a discord user";
        this._syntax = config.global.prefix + this.commandname + " <@discord user> is/isn't <new alias>";
    }

   run() {
        return new Promise((resolve, reject) => {
            let theMatch = this.message.content.match(new RegExp("^" + config.global.prefix + "\\w+ (\\S+) (is|isn'?t) (\\w+) ?(\\w+)?", "mi"));
            console.log(theMatch);
            if(theMatch !== null && theMatch.length > 3) {
                resolve(this.userAlias(theMatch));
            } else {
                this.reply = "can't assign an alias, command is missing parameters";
                resolve(true);
            }
        });
    }

    getUserAlias(targetUser, alias) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM userAlias WHERE `userId` = ? AND `userAlias` = ?", [targetUser.id, alias], (err, row) => {
                if(err !== null) {
                    reject(err);
                } else if(row === undefined) {
                    resolve(false);
                } else {
                    resolve(row);
                }
            });
        });
    }

    insertAlias(targetUser, alias) {
        return new Promise((resolve, reject) => {
            this.getUserAlias(targetUser, alias)
                .then((result) => {
                    if(result === false) {
                        let insertStatement = db.prepare("INSERT INTO userAlias (userId, userName, userDiscrim, userAlias) VALUES (?, ?, ?, ?);");
                        insertStatement.run([targetUser.id, targetUser.username, targetUser.discriminator, alias], (re) => {
                            if(re === null || re === 'null') {
                                this.reply = "Understood, <@" + targetUser.id + "> is now " + alias;
                                resolve(true);
                            } else {
                                this.error = "error in database execution during insert :" + re;
                                this.reply = "I'm sorry, but it seems like an error has occurred";
                                reject(false);
                            }
                        });
                    } else {
                        this.reply = "that user alias already exists";
                        resolve(true)
                    }
                })
                .catch((err) => {
                    this.error = "error in insertAlias during user lookup -- " + err;
                    reject(false);
                });
        });
    }

    deleteAlias(targetUser, alias) {
        console.log(alias);
        return new Promise((resolve, reject) => {
            this.getUserAlias(targetUser, alias)
                .then((result) => {
                    if(result === false) {
                        this.reply = "I couldn't find that user and alias combination";
                        resolve(true);
                    } else {
                        db.run("DELETE FROM userAlias WHERE id = ?", result.id, (err) => {
                            if(err !== null) {
                                this.error = "error in database execution during deletion :" + err;
                                reject(false);
                            } else {
                                this.reply = "Understood, <@" + result.userId + "> is no longer " + alias;
                                resolve(true);
                            }
                        });
                    }
                })
                .catch((err) => {
                    this.error = err;
                    reject(false);
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
        if(targetUser === '') {
            this.reply = "Sorry, it seems like you didn't specify a user";
            return true;
        }
        try {
            if(theMatch[2] === "is" && theMatch[3] !== "not") {
                return await this.insertAlias(targetUser, theMatch[3]);
            } else if(theMatch[2] === "isn't" || theMatch[2] === "isnt") {
               return await this.deleteAlias(targetUser, theMatch[3]);
            } else if(theMatch[2] === "is" && theMatch[3] === "not") {
                console.log(theMatch);
                console.log(theMatch[4]);
                return await this.deleteAlias(targetUser, theMatch[4])
            } else {
                this.reply = "Error in the alias command, are you sure you wrote it correctly?";
                return true;
            }
        } catch (e) {
            logger.error(e);
            return false;
        }

    }
}

commands.register(Alias, "alias");