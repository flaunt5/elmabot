class Admin extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "admin";
        this._desc = "A special administration command to configure a bot's settings";
        this._syntax = config.global.prefix + this.commandname + " <parameter> <value>";
        this.replyTo = true;
    }

    run() {
        return new Promise((resolve, reject) => {
            if(this.message.author.id === settings.ownerid) {
                let funcs = ["tweetchannel"];
                try {
                    let regexMatch = this.message.content.match(new RegExp("^(\\S+) (\\w+) (\\S+)?( .*)?", "mi"));
                    if(Array.isArray(regexMatch) && regexMatch.length > 2) {
                        regexMatch[2] = regexMatch[2].toLowerCase();
                        regexMatch[3] = regexMatch[3].toLowerCase();
                        if(funcs.includes(regexMatch[2])) {
                            switch (regexMatch[2]) {
                                case 'tweetchannel':
                                    this.tweetChannel(regexMatch[3])
                                        .then((re) => resolve(re))
                                        .catch((e) => logger.error('error occured in tweetchannel func: ' + JSON.stringify(e)));
                                    break;
                            }
                        } else {
                            this.reply = "I'm sorry that admin command doesn't seem to exist";
                            resolve(true);
                        }
                    } else {
                        this.reply = "I'm sorry I've encountered an error trying to read your command";
                        resolve(true);
                    }
                } catch (e) {
                    console.log(e);
                    this.reply = "I'm sorry I've encountered an error trying to read your command";
                    logger.error(JSON.stringify(e));
                    reject(false)
                }
            } else {
                this.reply = "you are not authorised to use this command";
                resolve(true);
            }

        });
    }

    tweetChannel(input) {
        return new Promise((resolve, reject) => {
            try {
                let channels = this.message.guild.channels.keyArray(),
                    serverId = this.message.guild.id,
                    theMatch = input.match(new RegExp("<#(\\d+)>", "i"));
                if(theMatch === null || channels.includes(theMatch[1]) === false) {
                    this.reply = "I'm sorry, but it seems like that is not a channel on this server";
                    resolve(true);
                } else {
                    db.get("SELECT `tweetCheckChannel` FROM `serverSettings` WHERE `serverid` = ? ;", serverId, (err, row) => {
                        if(err === null) {
                            let chan = this.message.guild.channels.get(theMatch[1]);
                            chan.send("Testing...")
                                .then((mess) => {
                                    mess.delete();
                                    db.run("UPDATE `serverSettings` SET `tweetCheckChannel` = ? WHERE `serverid` = ? ;", [theMatch[1], serverId], (err) => {
                                        if(err === null) {
                                            settings.general[this.message.guild.id].tweetCheckChannel = theMatch[1];
                                            this.reply = "Tweet verification channel has been updated to <#" + theMatch[1] + ">";
                                            resolve(true);
                                        } else  {
                                            console.log(err);
                                            reject(err);
                                        }
                                    });
                                })
                                .catch((error) => {
                                    if(error.message === "Missing Access") {
                                        this.reply = "I'm sorry, it seems like I don't have access to that channel";
                                        resolve(true)
                                    } else {
                                        logger.error("error while attempting to test tweetcheck channel");
                                        reject(false);
                                    }
                                });
                        } else if(row === undefined) {
                            this.reply = "Settings do not appear to be set for this server, please contact bot owner";
                            logger.warn("attempt at changing settings where none existed for server " + serverId);
                        } else reject(err);
                    })
                }
            } catch (e) {
                console.log(e);
                reject(e);}
        })
    }
}

commands.register(Admin, ["admin", "config"]);