class Tweet {
    constructor(body, message, user) {
        this._body = body;
        this._message = message;
        this._user = user;
        this._twitterUser = config.twitter.accountname;
        this._userVotes = [];
        this._posted = [];
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    get posted() {
        return this._posted;
    }

    set posted(value) {
        this._posted = value;
    }

    tweetIt(multi = false) {

    }

    tweetSplitter(body) {
        let twitterPhrase = "@" + twitterUser + " ... (10/10) ",
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
                    result[i] = "@" + twitterUser + " " + result[i] + toAdd;
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
                            multiPostTweet(bodies, users, index, tweet.id_str)
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