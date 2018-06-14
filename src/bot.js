
logger.info("bot started");

let settings = {};

//Where the discord.js magic really starts
discordClient.login(config.discord.token)
    .then(() => {
        logger.info("Login successful");
    })
    .catch((error) => {
        logger.error("Error while attempting login to Discord : " + error);
    });

discordClient.on('ready', () => {
    logger.info("bot is ready");
    settings = new Settings(discordClient, config.discord.ownerid);
});

discordClient.on("warn", (info) => logger.warn(info));
discordClient.on("error", (error) => logger.error(error));

discordClient.on("message", (message, user) => {
    //No talkie to other bots
    if(message.author.bot || message.channel.type === "dm") return;

    //If it's a command it runs and exits the thing
    let commandMatch = message.content.match(prefix);
    let commandMatch = message.content.match(getPrefixRegex(message.guild.id));
    if (commandMatch !== null && commandMatch.length > 1 && settings.ready === true) {
        commands.run(commandMatch[1], message);
        return;
    }

    //if it's a markov it runs and exits
    let markovComm = message.content.match(new RegExp("^(<@!?" + discordClient.user.id + ">|" + config.global.name + ") (do|are) you (.+)$", "mi"));
    if(markovComm !== null && markovComm.length > 2) {
        gibMarkov(markovComm[3], message.guild.id)
            .then((rep) => message.channel.send(rep))
            .catch(() => message.reply("I'm sorry it seems like an error has occurred"));
        return;
    }

});

discordClient.on('messageReactionAdd', (messReac, requester) => {
    let guildId = messReac.message.guild.id,
        tweetEmote = settings.general[guildId].tweetemote;
    if ((messReac.emoji.name === 'tweet' || messReac.emoji.name === tweetEmote) && messReac.count === 1) {
        let theMessage = new Tweet(messReac.message, requester);
        theMessage.execute();
    }
});

