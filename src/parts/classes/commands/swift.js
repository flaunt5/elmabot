class Swift extends Ecommand {
    constructor(message) {
        super(message);
        this._commandname = "swift";
        this._desc = "Fetch me some Taytay";
        this._syntax = this.prefix + this.commandname;
    }

    run() {
        return new Promise((resolve, reject) => {
            let options = {
                uri: 'https://api.reddit.com/r/TaylorSwiftPictures/random.json?obey_over18=true',
                headers: {
                    'User-Agent': 'nodejs:elmabot:0.3.1 (by flaunt5)'
                },
                json: true
            };
            rp(options)
                .then(response => {
                    this.reply = response[0].data.children[0].data.url;
                    resolve(true);
                })
                .catch(error => {
                    this.error = error;
                    reject(error)
                })
        })

    }
}

commands.register(Swift, "swift");