/**Dependancies**/
const yaml    = require('js-yaml'),
      fs      = require('fs'),
      sqlite  = require('sqlite3'),
      Discord = require('discord.js'),
      Twitter = require('twitter'),
      winston = require('winston');

//gets values from config file
const config = getConfig();

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'config/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'config/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
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
      prefix = new RegExp("^" + config.global.prefix + "(\\w+)", "mi");

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
