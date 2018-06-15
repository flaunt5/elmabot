class Choose extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "Choose";
        this._desc = "Choose something from multiple options seperated by commas or semi-colons";
        this._syntax = config.global.prefix + this.commandname + "<option1, option2; option3; ...>";
    }

   run() {
        return new Promise((resolve, reject) => {
            let bits;
            try {
                bits = this.message.content.match(new RegExp("^(" + this.prefix + "\\w+) (.+)", "i"));
            } catch (e) {
                reject(e);
            }

            if(bits === null) {
                this.reply = "I need options to pick from 😖";
                resolve(true);
            } else {
                let string = bits[2];
                console.log(string);
                let list = string.split(new RegExp("[,;]", "m"));
                list = list.filter(v => v != '');
                console.log(list);
                if (list.length < 1) {
                    this.reply = "I can't choose from empty options 😖"
                } else if(list.length === 1) {
                    this.reply = "You only gave me one option so I'm gonna say " + list[0];
                } else {
                    this.reply = list[Math.floor(Math.random() * list.length)];
                }
                resolve(true);
            }
        });
    }
}

commands.register(Choose, ["choose", "pick", "decide"]);