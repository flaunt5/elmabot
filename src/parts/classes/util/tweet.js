class Tweet {
    constructor(message) {
        this._message = message;
        this._content = message.content;
        this._users = message.mentions.users.array();
        this._roles = message.mentions.roles.array();
        this._user = message.author;
        this._twitterUser = config.twitter.accountname;
    }

    get message() {
        return this._message;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    get user() {
        return this._user;
    }

    get users() {
        return this._users;
    }

    get roles() {
        return this._roles;
    }

    get twitterUser() {
        return this._twitterUser;
    }

    prepare() {
        return new Promise(resolve => {
            let reply = this.parseMessage();
        });

    }

    async parseMessage() {
        let content = await this.findUserAlias(this.content);
        if (this.users.length > 0) {
            content = this.replaceMentions(this.users, this.content, "users");
        }
        if (this.roles.length > 0) {
            content = this.replaceMentions(this.roles, this.content, "roles");
        }

        return content;
    }

    findUserAlias(content) {
        return new Promise(resolve => {
            db.each("SELECT userAlias AS alias FROM userAlias", (err, row) => {
                let match = content.match(row.alias);
                if (match) {
                    console.log(match[0]);
                    content.replace(match[0], userReplace)
                }
            });
            resolve(content)
        });
    }

    replaceMentions(toReplace, content, type = "users") {
        let result,
            prefix,
            replace;
        if (type === "users") {
            prefix = "<@";
            replace = userReplace;
        } else if (type === "roles") {
            prefix = "<@&";
            replace = roleReplace;
        } else {
            return content;
        }
        for (let i = 0, len = users.length; i < len; i++) {
            let regex = new RegExp(prefix + users[i].id + ">", "g");

            result = content.replace(regex, replace);
        }
        return result;
    }

    tweetIt(multi = false) {

    }

    tweetSplitter(body) {
        let twitterPhrase = "@" + this.twitterUser + " ... (10/10) ",
            length = 240 - twitterPhrase.length;
        if(body.length > length) {
            let pos = length,
                lastPos = 0,
                charAtPos = body.charAt(pos),
                result = [];

            for(let i = length, len = body.length; i < len; i + length) {
                charAtPos = body.charAt(pos);
                while(charAtPos !== ' ') {
                    pos--;
                    charAtPos = body.charAt(pos);
                }
                result.push(body.slice(lastPos, pos));
                lastPos = pos + 1;
                pos = pos + length;

                if(pos > body.length) {
                    result.push(body.slice(lastPos));
                    break;
                }
            }
            for(let i = 0, len = result.length; i < len; i++) {
                let toAdd = '';
                if((i +1) === len) {
                    toAdd = " (" + (i + 1) + "/" + len + ")";
                } else {
                    toAdd = "..";
                    if(result[i].charAt(result[i].length - 1) !== ".") {
                        toAdd = toAdd + ". ";
                    }
                    toAdd = toAdd + "(" + (i + 1) + "/" + len + ")";
                }
                if(i > 0) {
                    result[i] = "@" + this.twitterUser + " " + result[i] + toAdd;
                } else {
                    result[i] = result[i] + toAdd;
                }
            }
            return result;
        } else {
            return false;
        }
    }

    postTweet(body) {
        return twitterClient.post('statuses/update', {status: body})
            .then()
    }

    multiPostTweet(bodies, users, index = 0, lastTweetId = 0) {
        let leng = bodies.length;
        if(index <= leng) {
            if(bodies[index] !== undefined) {
                let params = {
                    status: bodies[index]
                };
                if(lastTweetId !== 0) {
                    params['in_reply_to_status_id'] = lastTweetId;
                }
                twitterClient.post('statuses/update', params)
                    .then(function (tweet) {
                        index++;
                        console.log(tweet);
                        setTimeout(function () {
                            this.multiPostTweet(bodies, users, index, tweet.id_str)
                        }, 3000);
                    })
                    .catch(function (error) {
                        console.log(error);
                        return false;
                    })
            } else {
                console.dir("breaking point");
                return true;
            }
        }
    }
}