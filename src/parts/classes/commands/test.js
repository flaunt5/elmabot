class Test extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "test";
        this._replyTo = true;
    }

    run() {
        return new Promise(resolve => {
                this.reply = "hi";
                resolve(true)
        });
    }
}

commands.register(Test, "test");