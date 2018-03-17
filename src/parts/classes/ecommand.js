class Ecommand {
    constructor(message) {
        this._commandname = "command";
        this._desc ="This command doesn't have a description yet";
        this._syntax= prefix + this.commandnamename;
        this._message = message;
        this._emessage = new Emessage(message);
        this._reply = '';
        this._user = message.user;
        this._channel = message.channel;
        this._error = '';
        this._message = message;
    }

    get commandname() {
        return this._name;
    }

    set commandname(value) {
        this._name = value;
    }

    get alias() {
        return this._alias;
    }

    set alias(value) {
        this._alias = value;
    }

    get desc() {
        return this._desc;
    }

    set desc(value) {
        this._desc = value;
    }

    get syntax() {
        return this._syntax;
    }

    set syntax(value) {
        this._syntax = value;
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    get reply() {
        return this._reply;
    }

    set reply(value) {
        this._reply = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get channel() {
        return this._channel;
    }

    set channel(value) {
        this._channel = value;
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._error = value;
    }

    run() {
        this.reply = "hello";
        return true;
    }

    respond() {
        return this.message.reply(this.reply);
    }

}