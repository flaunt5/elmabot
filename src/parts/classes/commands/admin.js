class Admin extends Ecommand {
    constructor(message)
    {
        super(message);
        this._commandname = "admin";
        this._desc = "A special administration command to configure a bot's settings";
        this._syntax = config.global.prefix + this.commandname + " <parameter> <value>";
    }

    run()
    {
        return new Promise((resolve, reject) => {

        });
    }
}

commands.register(Admin, ["admin", "config"]);