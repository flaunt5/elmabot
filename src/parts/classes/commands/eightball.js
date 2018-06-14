class Eightball extends Ecommand {
    constructor(message)
    {
        super(message);
        this._commandname = "8ball";
        this._desc = "Ask a question, get an answer";
        this._syntax = config.global.prefix + this.commandname + "<whatever you want to ask>";
    }

    run() {
        return new Promise((resolve, reject) => {
            let res = eightball();
            if(res === false) {
                this.reply = "I'm sorry, something seems to have gone wrong";
                resolve(false);
            } else {
                this.reply = res;
                resolve(true);
            }
        });
    }
}

commands.register(Eightball, ["8ball", "question", "eightball"]);