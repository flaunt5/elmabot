
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
    if(message.author.bot) return;

    console.dir(settings);

    let commandMatch = message.content.match(prefix),
        serverId = message.guild.id;

    if (commandMatch !== null && commandMatch.length > 1 && settings.ready === true) {
        commands.run(commandMatch[1], message);
    }
});

discordClient.on('messageReactionAdd', (messReac, requester) => {
    if (messReac.emoji.name === 'tweet') {
        let theMessage = new Tweet(messReac.message, requester);
        theMessage.execute();
    }
});

