class Ecommand {
    constructor(message) {
        this._commandname = "command";
        this._desc ="This command doesn't have a description yet";
        this._syntax= config.global.prefix + this.commandname;
        this._message = message;
        this._params = this.getParams();
        this._reply = '';
        this._member = message.member;
        this._error = '';
        this._replyTo = false;
    }

    get message() {
        return this._message;
    }

    get commandname() {
        return this._commandname;
    }

    get desc() {
        return this._desc;
    }

    get syntax() {
        return this._syntax;
    }

    get params() {
        return this._params;
    }

    get reply() {
        return this._reply;
    }

    set reply(value) {
        this._reply = value;
    }

    get member() {
        return this._member;
    }

    set member(value) {
        this._member = value;
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._error = value;
    }

    get replyTo() {
        return this._replyTo;
    }

    set replyTo(value) {
        this._replyTo = value;
    }

    /**
     * Gets an an array with all the parameters passed to a command
     * @returns {array}
     */
    getParams() {
        let string = this.message.content.match(prefix)[2];
        if(string !== undefined) {
            return string.split(" ");
        } else {
            return false;
        }

    }

    /**
     * a base run function to be expanded upon per command,
     * this will be called by the main command object to run individual commands
     * Each command should perform it's main functions within this umbrella function
     * @returns {Promise}
     */
    run() {
        return new Promise(resolve => {
            this.reply = "hello";
            resolve(true);
        });
    }

    /**
     * A base function that returns whatever reply has been set by other base functions,
     * the command object returns this response after the command has been successfully ran
     * defaults to sending it as a normal message, but can send it as reply if replyTo is set to true
     */
    respond() {
        if(this.replyTo === true) {
            return this.message.reply(this.reply);
        } else {
            return this.message.channel.send(this.reply);
        }
    }

}