discordClient.on('ready', () => {
    console.log("bot is up and running");
});

discordClient.on("message", (message, user) => {
    //No talkie to other bots
    if(message.author.bot) return;

    let content = message.content,
        commandMatch = content.match(commandWord),
        channel = message.channel;

    let users = replaceMentionsUsers(message, content),
        roles = replaceMentionsRoles(message, content);


    if (commandMatch !== null && commandMatch.length > 1) {
        let commandReturn = baseMessageCommands(commandMatch[1], message, user);
        if (commandReturn !== false) {
            channel.send(commandReturn);
        } else {
            channel.send("I'm sorry, I don't recognize that command 😦")
        }
    }
});

discordClient.on('messageReactionAdd', (messReac, messUser) => {
    if(messReac.message.channel.name === "swift" && messReac.emoji.name === 'tweet' && messReac.count > 1) {
        let theMessage = messReac.message,
            content = theMessage.content,
            users = theMessage.mentions.users.array();

    }
});

