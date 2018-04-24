/**Dependencies
 * This calls all the bits and pieces required
 * if you're looking at this you might have seen it before
 * **/
const yaml    = require('js-yaml'),
      fs      = require('fs'),
      sqlite  = require('sqlite3'),
      Discord = require('discord.js'),
      Twitter = require('twitter'),
      { createLogger, format, transports } = require('winston'),
      {combine, timestamp, label, printf} = format,
      request = require('request'),
      rp = require('request-promise-native'),

//gets values from config file
    config = getConfig(),

//set up Winston logger format
    myFormat = printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    }),

// set up the logger using Winston
    logger = createLogger({
        format: combine(
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.File({ filename: 'config/error.log', level: 'error' }),
            new transports.File({ filename: 'config/combined.log' })
        ]
    }),

//several necessary global constants, prefix should not be changed under any circumstance
    userReplace = "@" + config.global.replace,
    roleReplace = userReplace + "s",
    prefix = new RegExp("^" + config.global.prefix + "(\\w+) ?(.*)?", "mi"),

//set up database, needs actual database to exist or else bot gets unhappy
    db = new sqlite.Database("./config/db.sqlite"),

//configure discord access
    discordClient = new Discord.Client(),

//Configure twitter access keys
    twitterClient = new Twitter({
        consumer_key: config.twitter.consumer.key,
        consumer_secret: config.twitter.consumer.secret,
        access_token_key: config.twitter.accesstoken.key,
        access_token_secret: config.twitter.accesstoken.secret
    });

//Where the discord.js magic really starts
discordClient.login(config.discord.token);

/** Slight changes to how some shit works depending on whether or not you're in developer mode
 * make sure you don't fuck up your environment variables, kids
 * **/
if (process.env.NODE_ENV !== 'production') {
    //adds an extra level of transport so it logs errors to console in development mode
    logger.add(new transports.Console({
        format: combine(
            timestamp(),
            myFormat
        ),
    }));
    //puts sqlite in verbose mode for development purposes
    sqlite.verbose();
}

/**
 * simple function to get and parse the YAML config file
 * @returns {array}
 */
function getConfig() {
    try {
        let conf = yaml.safeLoad(fs.readFileSync("./config/config.yml", 'utf8')),
            jsonConf = JSON.stringify(conf, null, 4);
        return JSON.parse(jsonConf);
    } catch (e) {
        logger.error(e);
        process.exit(1);
    }
}
