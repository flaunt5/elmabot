//Where the discord.js magic really starts
console.log(getCurrentDatetime() + " bot started");

discordClient.login(config.discord.token)
    .then(() => {
        console.log(getCurrentDatetime() + " Login successful")
    })
    .catch((error) => {
        logger.error("Error while attempting login to Discord : " + error);
    });

discordClient.on('ready', () => {
    console.log(getCurrentDatetime() + " bot is up and running");
});

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

