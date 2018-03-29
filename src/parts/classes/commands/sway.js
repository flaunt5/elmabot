class Sway extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "sway";
        this._desc = "Summons an appropriate visual representation";
        this._syntax = config.global.prefix + this.commandname;
    }

    run() {
        return new Promise(((resolve, reject) => {
            if(fs.existsSync("./img/sway.jpg")) {
                this.reply = {
                    files : [{
                        attachment: "./img/sway.jpg",
                        name: "sway.jpg"
                    }]
                }
                resolve(true);
            } else {
                this.error("Sway image not found");
                reject(false);
            }
        }))
    }
}

commands.register(Sway, ["sway", "headpatslut"]);