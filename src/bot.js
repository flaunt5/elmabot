
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

    let commandMatch = message.content.match(prefix),
        serverId = message.guild.id;

    console.dir(message.content);
    console.dir(discordClient.user.id);
    console.dir(message.author.id);

    if (commandMatch !== null && commandMatch.length > 1 && settings.ready === true) {
        commands.run(commandMatch[1], message);
        return;
    }

    let markovComm = message.content.match(new RegExp("^<@!" + discordClient.user.id + "> (do|are) you (.*)"));
    if(markovComm !== null markovComm.length > 2) {
        message.reply(gibMarkov(markovComm[2]));
    }

});

discordClient.on('messageReactionAdd', (messReac, requester) => {
    let guildId = messReac.message.guild.id,
        tweetEmote = settings.general[guildId].tweetemote;
    if (messReac.emoji.name === 'tweet' || messReac.emoji.name === tweetEmote) {
        let theMessage = new Tweet(messReac.message, requester);
        theMessage.execute();
    }
});

