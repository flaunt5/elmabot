class Tweet {
    constructor(message, requester) {
        this._message = message;
        this._content = message.content;
        this._users = message.mentions.users.array();
        this._roles = message.mentions.roles.array();
        this._author = message.author;
        this._requester = requester;
        this._twitterUser = config.twitter.accountname;
    }

    get message() {
        return this._message;
    }

    get content() {
        return this._content;
    }

    get author() {
        return this._author;
    }

    get requester() {
        return this._requester;
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

    /**
     * gets the id of the channel where the tweet is to be checked
     * @returns {Object} discordjs channel object of either the channel where the tweet is to be checked or the one where the request was made
     */
    getTwitterChannel() {
        let rep = settings.general[this.message.guild.id].tweetCheckChannel;
        if(rep === null || rep == false || rep === undefined) {
            return this.message.channel;
        } else {
            return this.message.guild.channels.get(rep);
        }
    }

    /**
     * This function actually does the bulk of the work, calls the necessary prepare function and chains the series of
     * following functions together
     */
    execute() {
        let chan = this.getTwitterChannel();
        this.prepare()
            .then((reply) => {
                chan.send(this.tweetFormSelect(reply))
                    .then((mess) => {
                        const approval = ["✔", "☑", "✅"],
                              filt = (reaction) => approval.includes(reaction.emoji.name) || reaction.emoji.name === "❌";
                        mess.awaitReactions(filt, {time: 300000, max: 1})
                            .then(collect =>  {
                                if(approval.includes(collect.firstKey())) {
                                    if(Array.isArray(reply)) {
                                        this.multiPostTweet(reply)
                                            .then((res) => {
                                                chan.send("Tweets have been sent");
                                            })
                                            .catch((err) => {
                                                logger.error("Error while posting multiple tweets : " + JSON.stringify(err));
                                                chan.send("I'm sorry, it seems like an error has occurred while sending the tweets")
                                            })
                                    } else {
                                        twitterClient.post('statuses/update', {status: reply})
                                            .then(() => {
                                                chan.send("Tweet has been sent");
                                            })
                                            .catch((err) => {
                                                logger.error("Error while posting tweet : " + err);
                                                chan.send("I'm sorry, it seems like an error has occurred while sending the tweets")
                                            })
                                    }
                                } else {
                                    chan.send("Understood, tweet will not be sent");
                                }
                            })
                            .catch((err) => {
                                logger.error("Error while await response on tweet verification : " + err);
                                chan.send("I'm sorry, an error has occurred and the process has been interrupted");
                                mess.delete()
                                    .catch((delerr) => {
                                        logger.error("Eror while attempting to delete pre-tweet message : " + delerr);
                                    })
                            });
                    })
                    .catch((err) => {
                        logger.error("Error while sending pre-tweet reply : " + err);
                        chan.send("An error seems to have occurred");
                    })
            })
            .catch((error) => {
                logger.error("Error while attempting preparation of the tweets : " + JSON.stringify(error));
                chan.send("An error seems to have occurred");
            })
    }

    /**
     * This function takes the post to be tweeted, checks if there will be multiple tweets, and returns an object that
     * will serve as a response/confirmation of what is actually going to be tweeted out
     * @param reply {string|Array} - the Discord post, processed, to be tweeted out
     * @returns {object}
     */
    tweetFormSelect(reply) {
        if(Array.isArray(reply)) {
            let fields = [];
            for(let i = 0; i < reply.length; i++) {
                fields.push( {
                    name: "Tweet " + (i + 1) + " out of " + reply.length,
                    value: reply[i]
                })
            }
            return { embed: {
                    color: 43263,
                    title: "Tweets to send, please verify ",
                    timestamp: getCurrentDatetime(),
                    description: "Since the original post is too long it will be cut up in multiple parts like this:",
                    author: {
                        icon_url: this.author.displayAvatarURL,
                        name: "original post by " + theNick(this.message.member)
                    },
                    footer: {
                        text: "requested by " + this.requester.username,
                        icon_url: this.requester.displayAvatarURL
                    },
                    fields: fields
                }
            };
        } else {
            return { embed: {
                    color: 43263,
                    title: "Tweet to send, please verify ",
                    timestamp: getCurrentDatetime(),
                    description: reply,
                    author: {
                        icon_url: this.author.displayAvatarURL,
                        name: "original post by " + theNick(this.message.member)
                    },
                    footer: {
                        text: "requested by " + this.requester.username,
                        icon_url: this.requester.displayAvatarURL
                    }
                }
            };
        }
    }

    /**
     * Calls the parse method on the post to be tweeted out, and if needed splits the parsed message into an array
     * @returns {Promise<Array|Boolean>}
     */
    prepare() {
        return new Promise((resolve, reject) => {
            this.parseMessage(this.content)
                .then((ret) => {
                    let reply = ret;
                    if (reply !== false && reply.length > 235) {
                        reply = this.tweetSplitter(reply);
                        resolve(reply);
                    } else if(reply !== false) {
                        resolve(reply);
                    } else {
                        reject(false);
                    }
                });
        });
    }

    /**
     * Parses the Discord Post and removes all mentions of aliases and/or Discord mentions
     * @param inp {String} - the raw body of the Discord post to be tweeted out
     * @returns {Promise<String|Boolean>}
     */
    async parseMessage(inp) {
        let content = await this.findUserAlias(inp);

        if (this.users.length > 0) {
            content = this.replaceMentions(this.users, content, "users");
        }
        if (this.roles.length > 0) {
            content = this.replaceMentions(this.roles, content, "roles");
        }

        if (typeof content === "string") {
            return content;
        } else {
            logger.error("tweet parser returns non-string answer");
            logger.error(content);
            return false;
        }
    }

    /**
     * checks Aliases for users that exist in the databases and if any of them appear in the post
     * if an alias is found it is replaced with the predefined word or phrase
     * @param content {String} - the raw content of the Discord post to be processed
     * @returns {Promise<String>}
     */
    findUserAlias(content) {
        return new Promise((resolve) => {
            db.each("SELECT userAlias AS alias FROM userAlias", (err, row) => {
                let match = content.match(row.alias);
                if (match) {
                    content = content.replace(match[0], userReplace);
                }
            }, () => {
                resolve(content)
            });
        });
    }

    /**
     * checks the content of the Discord post for role or user mentions and replaces them with a pre-defined word or phrase
     * @param toReplace {Array} - an Array of mentions to replace
     * @param content {String} - the content of the Discord post, with Aliases already replaced
     * @param type {String} - whether to replace user or role mentions, defaults to user mentions
     * @returns {String}
     */
    replaceMentions(toReplace, content, type = "users") {
        let result,
            prefix,
            replace;
        if (type === "users") {
            prefix = "<@!?";
            replace = userReplace;
        } else if (type === "roles") {
            prefix = "<@&";
            replace = roleReplace;
        } else {
            return content;
        }
        for (let i = 0, len = toReplace.length; i < len; i++) {
            let regex = new RegExp(prefix + toReplace[i].id + ">", "g");
            result = content.replace(regex, replace);
        }
        return result;
    }

    /**
     * Separates the body of the text into multiple parts if it is too long to be tweeted out in one go
     * Returns an array with the prepared tweets or FALSE if separating into bits proved unnecessary
     * @param body {String} - the now processed body of the Discord post to be tweeted out
     * @returns {Array|Boolean}
     */
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

    /**
     * Posts multiple tweets in sequence, with 3 seconds between each tweet, into a twitter thread
     * @param bodies {Array} - Array containing the individual tweets
     * @param index {Number} - the index for the loop
     * @param lastTweetId {Number} - the ID for the last tweet if one was made prior, for threading purposes
     * @returns {Promise<Object|Boolean>}
     */
    multiPostTweet(bodies, index = 0, lastTweetId = 0) {
        return new Promise((resolve, reject) => {
            if(index <= bodies.length && bodies[index] !== undefined) {
                let params = { status: bodies[index] };
                if(lastTweetId !== 0) params['in_reply_to_status_id'] = lastTweetId;
                twitterClient.post('statuses/update', params)
                    .then((tweet) => {
                        index++;
                        setTimeout( () => {
                            this.multiPostTweet(bodies, index, tweet.id_str)
                                .then(()=> {
                                    resolve(true);
                                })
                                .catch((err) => logger.error(JSON.stringify(err)))
                        }, 3000);
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                resolve(true)
            }
        });
    }
}