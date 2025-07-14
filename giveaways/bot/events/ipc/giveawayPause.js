const pause = require("../../commands/sub/pause");

module.exports = async (payload, client) => {
    const guild = client.guilds.cache.get(payload.guildId);
    if (!guild) return;

    const member = guild.members.cache.get(payload.memberId);
    await pause(member, payload.message_id);
};
