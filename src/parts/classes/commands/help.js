class Help extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "help";
        this._desc = "Gives a list of commands or general information about them"
    }
}

commands.register(Help, ["help", "list", "commands"]);