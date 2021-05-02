const EventHandler = require("../../Structures/EventHandler.js");

module.exports = class extends EventHandler {
    constructor(...args) {
        super(...args, "Default message event handler");
    }

    async run(event, message) {
        const mentionRegex = RegExp(`^<@!${this.client.identifiers.selfID}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${this.client.identifiers.selfID}> `);

        if ((await this.client.Cache.user.isIndexed(message.author.id)) ?? true ) {
            try {
                const user = await this.client.user.getUser(message.author.id);
                await this.client.Cache.user.addToIndex(message.author.id);
                await this.client.Cache.user.update(message.author.id, user);
            } catch (err) {
                console.error("Error attempting to update user cache", err);
            }
        }
        if (!message.guild_id || (await this.client.Cache.user.get(message.author.id)).bot === true) return;

        if (message.content.match(mentionRegex)) this.client.channel.createMessage(message.channel_id, `My prefix for this guild is \`${this.client.prefix}\` :D`);
        const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        //To patch running multiple commands
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        this.client.debug.command && command ? console.log(`Frontend Command: ${cmd} Args: ${args}\nBackend Command:`, command.name) : undefined;
        if (command) {
            command.run(message, args).catch(err => {
                console.error(err);
                this.client.channel.createMessage(message.channel_id, `<@${message.author.id}> Error when running command, ${err}`);
            });
        }
    }
};