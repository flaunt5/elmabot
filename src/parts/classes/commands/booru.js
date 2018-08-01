class Booru extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "booru";
        this._desc = "search an image from either danbooru or safebooru";
        this._syntax = this.prefix + this.commandname + " <tags seperated by commas>";
    }

    run() {
        return new Promise((resolve, reject) => {

        });
    }
}

commands.register(Booru, ["booru", "b"]);