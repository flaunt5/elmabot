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
                this.error = "how command regex did not find any matches";
                reject(false);
            }
        });

    }
}