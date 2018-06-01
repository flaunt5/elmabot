class Settings {
    constructor(client, owner) {
        this._guilds = client.guilds.array();
        this._general = {};
        this._rights = {};
        this._ownerid = owner;
        this._guildstring = '';
        this._ready = false;
        this.init();
    }

    get guilds() {
        return this._guilds;
    }

    get guildstring() {
        return this._guildstring;
    }

    set guildstring(value) {
        this._guildstring = value;
    }

    set guilds(value) {
        this._guilds = value;
    }

    get general() {
        return this._general;
    }

    set general(value) {
        this._general = value;
    }

    get rights() {
        return this._rights;
    }

    set rights(value) {
        this._rights = value;
    }

    get ready() {
        return this._ready;
    }

    set ready(value) {
        this._ready = value;
    }

    getGuildString() {
        for(let i = 0; i < this.guilds.length; i++) {
            if(i === 0) {
                this.guildstring = this.guildstring +  this.guilds[i].id;
            } else {
                this.guildstring = this.guildstring + ", " + this.guilds[i].id;
            }
        }
    }

    createBlankConfig(server) {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO serverSettings (serverid) VALUES (?)", [server],(re) => {
                if(re === null) resolve(true);
                else reject(re);
            });
        });
    }

    getSettings() {
        return new Promise((resolve, reject) => {
            let settings = {};
            db.each("SELECT * FROM `serverSettings` WHERE `serverid` IN (?);", [this.guildstring], (err, row) => {
                if(err !== null) logger.warn("error while getting settings for server : " + JSON.stringify(err));
                else {
                    settings[row['serverid']] = row;
                    if(row.commandprefix === null || row.commandprefix === undefined || row.commandprefix == 0) {
                        settings[row['serverid']]['commandprefix'] = config.global.prefix;
                    }
                }
            }, (finErr) => {
                if(finErr !== null) reject(finErr);
                else resolve(settings);
            })
        });
    }

    getRights() {
        let rights = {};
        return new Promise((resolve, reject) => {
            db.each("SELECT * FROM `rights` WHERE `server` IN (?);", [this.guildstring], (err, row) => {
                if(err !== null) logger.warn("error while getting rights for server : " + JSON.stringify(err));
                else rights[row['serverid']] = row;
            }, (finErr) => {
                if(finErr !== null) reject(finErr);
                else resolve(rights);
            });
        });
    }

    init() {
        let guilds = this.guilds;
        if(guilds.length < 1) return false;

        this.getGuildString();

        this.getSettings()
            .then((settings) => {
                let secIndex = 0,
                    guildSett = Object.keys(settings);
                for(let i = 0; i < guilds.length; i++) {
                    let guildId = guilds[i].id;
                    if(guildSett.includes(guildId)) {
                        secIndex++;
                    } else {
                        this.createBlankConfig(guildId)
                            .then(() => {
                                guilds[i].channels.get(guilds[i].systemChannelID).send("No configuration exists for this server, use the " + config.global.prefix + "config command to set them");
                                secIndex++;
                            })
                            .catch((re) => {
                                logger.error("Error occurred when trying to create blank configuration for server : " + JSON.stringify(re));
                                guilds[i].channels.get(guilds[i].systemChannelID).send("No configuration exists for this server and an error occurred while attempting to set one. Please contact the bot owner if you wish to configure this server");
                                secIndex++;
                            })
                    }
                    if(secIndex === guilds.length) {
                        this.general = settings;
                        delete this._guilds;
                    }
                }
                this.getRights()
                    .then((rights) => {
                        this.rights = rights;
                        this.ready = true;
                    })
                    .catch(() => logger.error("error while querying server rights : " + JSON.stringify(finErr)));
            })
            .catch((finErr) => logger.error("error while querying server settings : " + JSON.stringify(finErr)))
    }
}