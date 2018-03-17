class Help extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "help";
        this._desc = "Gives a list of commands or general information about them"
    }

    run() {
        
        return true;
    }

    respond() {
        return this.channel.send(this.reply);
    }
}

commands.register(Help, ["help", "list", "commands"]);