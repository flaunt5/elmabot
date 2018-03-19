class Commands {
    constructor() {
        this._list = {};
        this._formatlist = [];
        this._aliaslist = {};
    }

    get list() {
        return this._list;
    }

    set list(value) {
        this._list = value;
    }

    get formatlist() {
        return this._formatlist;
    }

    set formatlist(value) {
        this._formatlist = value;
    }

    get aliaslist() {
        return this._aliaslist;
    }

    set aliaslist(value) {
        this._aliaslist = value;
    }

    register(command, alias) {
        let list = this.list,
            name = '';
        if(Array.isArray(alias) && alias.length > 0) {
            name = alias[0];
            for(let i = 0; i < alias.length; i++) {
                if(typeof alias[i] === 'string') {
                    list[alias[i]] = command;
                }
            }
            let alObj = this.aliaslist;
            alObj[alias[0]] = alias;
            alObj[alias[0]].shift();
            this.aliaslist = alObj;

        } else if(typeof alias === 'string' && alias.length > 1) {
            list[alias] = command;
            name = alias;
        }
        this.list = list;
        this.formatlist.push(name);
    }

    run(command, message) {
        let list = this.list;
        command = command.toLowerCase();
        if(list[command] !== undefined) {
            let comm = new list[command](message);

            if(comm.run()) {
                comm.respond()
            } else {
                this.handleError("command found but error in execution", comm)
            }
        } else {
            message.reply("command not recognized");
        }
    }

    handleError(error, comm) {
        logger.warn(error + " -- " + "{" + comm.commandname.toUpperCase() + "}" + comm.error)
    }
}

const commands = new Commands();