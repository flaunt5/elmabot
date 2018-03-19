/**Dependancies**/
const yaml    = require('js-yaml'),
      fs      = require('fs'),
      sqlite  = require('sqlite3'),
      Discord = require('discord.js'),
      Twitter = require('twitter'),
    { createLogger, format, transports } = require('winston'),
    { combine, timestamp, label, printf } = format;

//gets values from config file
const config = getConfig();

const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: 'config/error.log', level: 'error' }),
        new transports.File({ filename: 'config/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            timestamp(),
            myFormat
        ),
    }));
}

function getConfig() {
    try {
        let conf = yaml.safeLoad(fs.readFileSync("./config/config.yml", 'utf8'));
        let jsonConf = JSON.stringify(conf, null, 4);
        return JSON.parse(jsonConf);
    } catch (e) {
        console.dir(e);
        process.exit(1);
    }
}

/**other constants**/
const userReplace = "@" + config.global.replace,
      roleReplace = userReplace + "s",
      prefix = new RegExp("^" + config.global.prefix + "(\\w+) ?(.*)?", "mi");

//set up database, needs actual database to exist or else bot gets unhappy
const db = new sqlite.Database("./config/db.sqlite");

//puts sqlite in verbose mode for development purposes
if(process.env.NODE_ENV !== "production") {
    sqlite.verbose();
}

//configure discord access
const discordClient = new Discord.Client();
discordClient.login(config.discord.token);

//Configure twitter access keys
const twitterClient = new Twitter({
    consumer_key: config.twitter.consumer.key,
    consumer_secret: config.twitter.consumer.secret,
    access_token_key: config.twitter.accesstoken.key,
    access_token_secret: config.twitter.accesstoken.secret
});
