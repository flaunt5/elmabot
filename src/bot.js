discordClient.on('ready', () => {
    console.log("bot is up and running");
});

discordClient.on("message", (message, user) => {
    //No talkie to other bots
    if(message.author.bot) return;

    let commandMatch = message.content.match(prefix);

    if (commandMatch !== null && commandMatch.length > 1) {
        commands.run(commandMatch[1], message);
    }
});

discordClient.on('messageReactionAdd', (messReac) => {
    if (messReac.emoji.name === 'tweet') {
        let theMessage = new Tweet(messReac.message);
    }
});

