class How extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "how";
        this._desc = "tells you much X is Y in percentages";
        this._syntax = this.prefix + this.commandname + " <what much something is> is <the something in question>";
    }

    run() {
        return new Promise((resolve, reject) => {
            try {
                let regex = new RegExp("^" + config.global.prefix + this.commandname + " (.+) (is|are) (.+[^\\?])\\??", "mi"),
                    theMatch = this.message.content.match(regex);

                if(theMatch === null) {
                    this.reply = "There seems to be a problem, are you sure you wrote the command correctly?";
                    resolve(true);
                } else {
                    console.log(theMatch);
                    let number = Math.random() * Math.floor(100),
                        num = number.toFixed(2);
                    this.reply = theMatch[3] + " " + theMatch[2] + " " + num + "% " + theMatch[1];
                    resolve(true)
                }
            } catch (e) {
                this.error = e;
                reject(e);
            }
        });
    }
}

commands.register(How, ["how", "compare"]);