class Commands {
    constructor() {
        this._list = {};
        this._aliaslist = {};
        this._ecomm = "";
    }

    get list() {
        return this._list;
    }

    set list(value) {
        this._list = value;
    }

    get aliaslist() {
        return this._aliaslist;
    }

    set aliaslist(value) {
        this._aliaslist = value;
    }

    get ecomm() {
        return this._ecomm;
    }

    set ecomm(value) {
        this._ecomm = value;
    }

    register(command, alias) {
        let list = this.list;
        if(Array.isArray(alias) && alias.length > 0) {
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
        }
        this.list = list;
    }

    help(command = false) {
        command = command.toLowerCase();
        let list = this.list;
        if(command !== false && this.list[command] !== undefined) {
            let comm = new list[command];
        }
    }

    run(command, message) {
        let list = this.list;
        command = command.toLowerCase();
        if(list[command] !== undefined) {
            let comm = new list[command](message);
            this.ecomm = comm;

            if(comm.run()) {
                comm.respond()
            } else {
                this.handleError("command found but error in execution")
            }
        } else {
            message.reply("command not recognized");
        }
    }

    handleError(error) {
        logger.warn(error + " -- " + this.ecomm.error)
    }
}

const commands = new Commands();