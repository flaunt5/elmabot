class Test extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "test";
        this._replyTo = true;
    }

    run() {
        this.reply = "heyheyhey";
        return true;
    }
}

commands.register(Test, "test");