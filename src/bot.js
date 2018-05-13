
logger.info("bot started");
//Where the discord.js magic really starts
discordClient.login(config.discord.token)
    .then(() => {
        console.log(getCurrentDatetime() + " Login successful")
        logger.info("Login successful");
    })
    .catch((error) => {
        logger.error("Error while attempting login to Discord : " + error);
    });

discordClient.on('ready', () => {
    logger.info("bot is ready");
});

discordClient.on("warn", (info) => logger.warn(info));
discordClient.on("error", (error) => logger.error(error));

discordClient.on("message", (message, user) => {
    //No talkie to other bots
    if(message.author.bot) return;

    let commandMatch = message.content.match(prefix);

    if (commandMatch !== null && commandMatch.length > 1) {
        commands.run(commandMatch[1], message);
    }
});

discordClient.on('messageReactionAdd', (messReac, requester) => {
    if (messReac.emoji.name === 'tweet') {
        let theMessage = new Tweet(messReac.message, requester);
        theMessage.execute();
    }
});

