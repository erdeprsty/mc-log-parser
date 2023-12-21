const { LogParser } = require("../utils/Parser");

class UserConnectionParser extends LogParser {
	constructor(logText) {
		super("UserConnectionParser");
		this.logText = logText;
	}
	isLoggedIn() {
		return this.logText.indexOf("logged in with entity id") > -1;
	}
	isLoggedOut() {
		return this.logText.indexOf("left the game") > -1;
	}
	parse() {
		const result = {
			time: null,
			player_name: null,
			type: null,
		};

		let time = this.logText.match(/\[\d{2}:\d{2}:\d{2}\]/);
		if (time) {
			if (time.length > 0) time = time[0];
		}

		if (this.isLoggedIn()) {
			let parsedPlayerName = this.logText.match(/(?<=INFO\]:)(.*)(\[)/);
			if (parsedPlayerName) {
				if (parsedPlayerName.length > 1) parsedPlayerName = parsedPlayerName[1];
			}
			Object.assign(result, {
				time,
				player_name: parsedPlayerName,
				type: "login",
			});
		} else if (this.isLoggedOut()) {
			let parsedPlayerName = this.logText.match(/: (.*?) left the game/);
			if (parsedPlayerName) {
				if (parsedPlayerName.length > 1) parsedPlayerName = parsedPlayerName[1];
			}
			Object.assign(result, {
				time,
				player_name: parsedPlayerName,
				type: "logout",
			});
		}

		return result;
	}
}

module.exports = UserConnectionParser;
