function registerTweetVotes(tweetId, users) {
    let sql = db.prepare("INSERT INTO tweetVote (userId, tweetId) VALUES(?, ?);");
    for(let i = 0;i < users.length; i++ ) {
        sql.run(users[i].id, tweetId)
    }
}

function registerTweet(body, userId, replyTo) {
    let sql = db.prepare("INSERT INTO twitter (tweetDate, tweetContent, userId");
}

/**
 * A simple function to send the API call to twitter to post one or more tweets
 * Does not parse or edit whatever text it's given
 * @param {string|array} tweetBody - a parsed and readied string to be tweeted out or array of such strings
 */
function postTweet(tweetBody) {
    twitterClient.post('statuses/update', {status: tweetBody}, function (error, tweet, response) {
        if(error) {
            console.log(new Error(error));
            return false;
        }
        console.log(tweet);
    });
}

function multiPostTweet(bodies) {
    async.forEachOf
    for(let i = 0; i < bodies.length; i++) {


    }
}

function multiTweetPromise(status, lastTweetId) {
    let params = {status : status};
    if(lastTweetId !== -1) {
        params.in_reply_to_status_id = lastTweetId;
    }
    return new Promise(
        function (resolve, reject) {
            twitterClient.post("statuses/update", params, function (error, tweet, response) {
                if(error) {
                    reject(new Error(error));
                }
                resolve(tweet.id);
            });
        }
    );
}

/**
 * Takes a body of text to be tweeted, checks if it's too long, and if it is splits it into tweetable following bits
 * bits are returned as an array
 * @param body - the text to be tweeted, as a simple string (has to be parsed by other functions BEFORE passing to this function)
 * @returns {boolean|array} FALSE if the body isn't too long to be tweeted in one tweet, array with each text bit to be tweeted otherwise
 */
function tweetSplitter(body) {
    let twitterPhrase = "@" + twitterUser + " ... (1/1) ",
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
            console.dir(result[i]);
        }
        return result;
    } else {
        return false;
    }
}

/**
 * General wrapper function for tweeting, calls other functions to parse, ready, and tweet the text
 * @param {object} message - a discord.js message object to be searched for mentions
 * @param {string} body - the content to be tweeted out as an unparsed string
 * @returns {boolean}
 */
function tweetIt(message, body) {
    let parsedBody = parseMessage(message, body),
        splitTweets = tweetSplitter(parsedBody),
        result = false;
    if(toTweet === false) {
        result = postTweet(parsedBody)
    } else {
        result = postTweet(splitTweets);
    }
    return result;
}

tweetIt("Loredm ipsum dolor sit amet, consectetur adipiscing elit. Ut in metus tincidunt mauris sagittis sodales. Sed ac laoreet eros. Duis sodales tincidunt sdapien, id egestas nunc ullamcorper at. Nulla fringilla faucibus nisl a vestibulum. Quisque blandit, velit eu vivedrra bibendum, sapien eros faucibus ligula, et ultrices nulla ipsum ut ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla facilisi. Cras scelerisque iaculis est a finibus. Phaselluds lacus libero, convallis id bibendum sollicitudin, lacinia et nunc. Etiam congue tellus sed sapien blandit interdum. Donec sceledrisque volutpat leo, at efficitur odio finibus ut. Sed eu urna at dui maximus interdum. Maecenas commodo, lodem id massa nunc. ");
