discordClient.on('ready', () => {
    console.log("bot is up and running");
});

console.log(commands);

discordClient.on("message", (message, user) => {
    //No talkie to other bots
    if(message.author.bot) return;

    let content = message.content,
        commandMatch = content.match(prefix),
        channel = message.channel;

    if (commandMatch !== null && commandMatch.length > 1) {
        commands.run(commandMatch[1], message);
    }
});

discordClient.on('messageReactionAdd', (messReac, messUser) => {
    if(messReac.message.channel.name === "swift" && messReac.emoji.name === 'tweet' && messReac.count > 1) {
        let theMessage = messReac.message,
            content = theMessage.content,
            users = theMessage.mentions.users.array();
    }
});

