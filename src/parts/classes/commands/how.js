class How extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "how";
        this._desc = "tells you much X is Y in percentages";
        this._syntax = config.global.prefix + this.commandname + " <what much something is> is <the something in question>";
    }

    run() {
        return new Promise((resolve, reject) => {
            let regex = new RegExp("^" + config.global.prefix + this.commandname + " (.+)+ is (.*)+(\\?)?", "mi"),
                theMatch = this.message.content.match(regex);

            if(theMatch === null) {
                this.reply = "There seems to be a problem, are you sure you wrote the command correctly?";
                resolve(true);
            }

        });

    }

}