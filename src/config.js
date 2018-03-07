/**Dependancies**/
const yaml    = require('js-yaml'),
      fs      = require('fs'),
      mysql  = require('mysql'),
      Discord = require('discord.js'),
      Twitter = require('twitter');

//puts sqlite in verbose mode for development purposes
if(process.env.NODE_ENV !== "production") {
    sqlite.verbose();
}

/**other constants**/
const userReplace = "@nerd",
      roleReplace = "@nerds",
      commandWord = new RegExp("^e&(\\w+)", "mi")

/**
 * Gets the YAML config file
 * @param file - String, location of config file
 * @returns {*}
 */
function getConfig(file) {
    try {
        let conf = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        let jsonConf = JSON.stringify(conf, null, 4);
        return JSON.parse(jsonConf);
    } catch (e) {
        console.dir(e);
        process.exit(1);
    }
}

//gets values from config file
const config = getConfig("./config/config.yml");

const db = mysql.createConnection({
    host : ''
})

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
//twitter username needed for threading tweets
const twitterUser = config.twitter.accountname;

//TODO make this not bad
//quick and dirty list of commands
const commandList = "-commands: lists all currently available bot commands\n" +
    "-alias: assigns a new nickname or alias to another user, aliases will be replaced in tweets as well\n" +
    "-help: ask me what I can do 😃\n";