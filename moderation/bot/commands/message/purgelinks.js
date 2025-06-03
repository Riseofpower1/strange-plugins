const { purgeMessages } = require("../../utils");

/**
 * @type {import('strange-sdk').CommandType}
 */
module.exports = {
    name: "purgelinks",
    description: "moderation:PURGE.SUB_LINK_DESC",
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageMessages", "ReadMessageHistory"],
    command: {
        enabled: true,
        usage: "[amount]",
        aliases: ["purgelink"],
    },

    async messageRun({ message, args }) {
        const amount = args[0] || 99;

        if (amount) {
            if (isNaN(amount)) return message.replyT("moderation:PURGE.INVALID_AMOUNT");
            if (parseInt(amount) > 99) return message.replyT("moderation:PURGE.TOO_MANY_MESSAGES");
        }

        const { channel } = message;
        const response = await purgeMessages(message.member, message.channel, "LINK", amount);

        const { guild } = message;
        if (typeof response === "number") {
            return channel.send(
                guild.getT("moderation:PURGE.SUCCESS", {
                    amount: response,
                    channel: channel.toString(),
                }),
            );
        } else if (response === "BOT_PERM") {
            return message.reply(guild.getT("moderation:PURGE.BOT_PERM", { channel }), 5);
        } else if (response === "MEMBER_PERM") {
            return message.reply(guild.getT("moderation:PURGE.MEMBER_PERM", { channel }), 5);
        } else if (response === "NO_MESSAGES") {
            return channel.send(guild.getT("moderation:PURGE.NO_MESSAGES"), 5);
        } else {
            return message.replyT("moderation:PURGE.ERROR");
        }
    },
};
