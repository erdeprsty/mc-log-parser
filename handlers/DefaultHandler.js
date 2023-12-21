const UserConnectionParser = require("../parser/UserConnectionParser");
const { sendMessage } = require("../utils/DiscordBot");

module.exports = async (logs = []) => {
	for (let log of logs) {
		const userConnectionParser = new UserConnectionParser(log);
		const { time, player_name, type } = userConnectionParser.parse();
		if (time && player_name) {
			console.log(time, player_name);
			switch (type) {
				case "login":
					sendMessage(`${time} ${player_name} connect ke server Minecraft`);
					break;
				case "logout":
					sendMessage(
						`${time} ${player_name} disconnect dari server Minecraft`
					);
					break;
			}
		}
	}
};
