class Help extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "help";
        this._desc = "Gives a list of commands or general information about them";
        this._syntax = config.global.prefix + this.commandname + " <command>";
    }

    run() {
        if (this.params.length >= 1) {
            this.reply = this.echoCommand(this.params[0]);
            return true;
        } else if(this.params === false || this.params.length < 1) {
            this.reply = this.echoList();
            return true;
        } else {
            this.error = "params incorrectly given or NaN";
            return false
        }
    }

    /**
     * Outputs a list of available commands and aliases as a string
     * @returns {string}
     */
    echoList() {
        let list = 'These are all currently available commands and their aliases:\n```\n';
        for(let i = 0; i < commands.formatlist.length; i++) {
            let toAdd = '';
            if(commands.aliaslist[commands.formatlist[i]] !== undefined) {
                toAdd = ' - ';
                for(let x = 0; x < commands.aliaslist[commands.formatlist[i]].length; x++) {
                    toAdd += commands.aliaslist[commands.formatlist[i]][x] + ", ";
                }
                toAdd = toAdd.substr(0, toAdd.length - 2);
            }
            list += commands.formatlist[i] + toAdd + "\n";
        }
        list += "```use " + config.global.prefix + "help with a specific command to get more information";
        return list;
    }

    /**
     * Outputs a rich embed reply with the specifics of a command, or a negative confirmation if the reply doesn't exist
     * @param command - the name of the command to look for
     * @returns {string|Object}
     */
    echoCommand(command) {
        let reply = '';
        console.log(command);
        if(commands.list[command] !== undefined) {
            let comm = new commands.list[command](this.message);
            reply = { embed: {
                    color: 53971,
                    title: comm.commandname,
                    description: comm.desc,
                    fields: [{
                        name: "Syntax",
                        value: comm.syntax
                    }],
                    footer: {
                        icon_url: this.user.avatarURL,
                        text: "Requested by " + theNick(this.member)
                    }
                }
            };
        } else {
            reply = "I don't recognize that command";
        }
        return reply;
    }
}

commands.register(Help, ["help", "list", "commands"]);