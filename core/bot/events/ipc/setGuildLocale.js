// TODO: Temporary logic, will be replaced with a better one in the future

module.exports = (payload, client) => {
    const { guildId, locale } = payload;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return [];

    guild.locale = locale;
    return "OK";
};
