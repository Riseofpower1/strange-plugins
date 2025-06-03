const { purgeMessages } = require("../../utils");

/**
 * @type {import('strange-sdk').CommandType}
 */
module.exports = {
    name: "purgeuser",
    description: "moderation:PURGE.SUB_USER_DESC",
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageMessages", "ReadMessageHistory"],
    command: {
        enabled: true,
        usage: "<@user|ID> [amount]",
        aliases: ["purgeusers"],
        minArgsCount: 1,
    },

    async messageRun({ message, args }) {
        const target = await message.guild.resolveMember(args[0]);
        if (!target) return message.replyT("NO_MATCH_USER", { query: args[0] });
        const amount = (args.length > 1 && args[1]) || 99;

        if (amount) {
            if (isNaN(amount)) return message.replyT("moderation:PURGE.INVALID_AMOUNT");
            if (parseInt(amount) > 99) return message.replyT("moderation:PURGE.TOO_MANY_MESSAGES");
        }

        const { channel } = message;
        const response = await purgeMessages(
            message.member,
            message.channel,
            "USER",
            amount,
            target,
        );

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
