class Reddit extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "reddit";
        this._desc = "gets a random post from a specified subreddit";
        this._syntax = config.global.prefix + this.commandname;
        this._forbidden = ["watchpeopledie", "kotakuinaction", "physicalremoval", "braincels", "redpill", "drama"]
        this._domains = ["i.redd.it", "i.imgur.com", "gfycat.com"]
    }

    get forbidden() {
        return this._forbidden;
    }

    get domains() {
        return this._domains;
    }

    run() {
        return this.fetchRed(this.params[0])
    }

    fetchRed(sub, limit = 0) {
        return new Promise((resolve, reject) => {
            if(this.forbidden.includes(sub)) {
                this.reply = "I'm not allowed to pull anything from that subreddit";
                resolve(true);
                return true;
            }
            if(limit > 5) {
                this.reply = "I'm sorry, but I couldn't find any suitable posts";
                this.message.channel.stopTyping(true);
                resolve(true);
                return true;
            }
            let options = {
                uri: 'https://api.reddit.com/r/' + sub + '/random.json?obey_over18=true',
                headers: {
                    'User-Agent': 'nodejs:elmabot:0.3.1 (by flaunt5)'
                },
                json: true
            };
            rp(options)
                .then(response => {
                    // console.log(response);
                    if(Array.isArray(response)) {
                        response = response[0];
                    }
                    console.log("response");
                    console.log(response);
                    console.log("=======");
                    if(response.StatusCodeError) {
                        this.reply("It seems like Reddit has experienced an error");
                        resolve(true);
                    }
                    if(response.message || response.data.children.length < 1) {
                        this.reply = "I'm sorry, I couldn't find that subreddit";
                        resolve(true);
                    }
                    if(this.domains.includes(response.data.children[0].data.domain)) {
                        this.reply = response.data.children[0].data.url;
                        resolve(true);
                    } else {
                        limit++;
                        this.message.channel.startTyping();
                        setTimeout(() => {
                            this.fetchRed(sub, limit)
                                .then((result) => {
                                    this.message.channel.stopTyping();
                                    resolve(result);
                                    return result;
                                });
                        }, 500);
                    }

                })
                .catch(error => {
                    this.error = error;
                    reject(error)
                })
        })
    }
}

commands.register(Reddit, ["reddit", "r"]);