const end = require("../../commands/sub/end");

module.exports = async (payload, client) => {
    const guild = client.guilds.cache.get(payload.guildId);
    if (!guild) return;
    const member = guild.members.cache.get(payload.memberId);
    await end(member, payload.message_id);
};
