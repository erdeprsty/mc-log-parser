const { Client, GatewayIntentBits } = require("discord.js");
const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});
client.on("ready", () => {
	console.log("[INFO] Discord bot is online");
});
client.login(token);

const sendMessage = (msg) => {
	if (!msg) return;
	try {
		client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then((channel) => {
			channel.send(msg);
		});
	} catch (err) {
		console.log(`[ERROR] Error sending message through Discord Bot`);
	}
};

module.exports = {
	client,
	sendMessage,
};
