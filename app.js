require('dotenv').config()

// Modules
const fs = require("fs");
const luxon = require("luxon");
const { exec } = require("child_process");
const crypto = require("crypto");

// Temporary
const logDigests = new Map();

// Utils
const Pubsub = require("./utils/Pubsub");
const { ArgumentParser } = require("./utils/Parser");

// Handlers
const defaultHandler = require("./handlers/DefaultHandler");

class MCLogWatcher {
	constructor() {
		this.argParser = new ArgumentParser();
		this.argParser.parse();
		this.pubsub = new Pubsub();
		this.pubsub.subscribe("init", () => {
			console.log("[INFO] Listening for log file changes");
		});
		this.pubsub.subscribe("changes", () => {
			console.log(
				`[INFO] Log file changes detected at ${luxon.DateTime.now().toFormat(
					"dd/MM/yyyy HH:mm:ss"
				)}`
			);
		});
	}
	subscribe(name, handler) {
		this.pubsub.subscribe(name, handler);
	}
	watch() {
		this.pubsub.publish("init");
		fs.watchFile(this.argParser.optionArgs["log-path"], async () => {
			try {
				exec(
					`tail -n 5 ${this.argParser.optionArgs["log-path"]}`,
					(err, stdout, stderr) => {
						if (err || stderr) {
							throw new Error(`Command error: ${err || stderr}`);
						}
						const logs = stdout.split(/\n/);
						const filteredLogs = logs.filter((log) => {
							const logDigest = crypto
								.createHash("md5")
								.update(Buffer.from(log, "utf-8"))
								.digest("base64");
							if (logDigests.has(logDigest)) {
								return false;
							}
							logDigests.set(logDigest, true);
							return true;
						});
						this.pubsub.publish("changes", filteredLogs);
					}
				);
			} catch (err) {
				console.log(`[ERROR] Error while watching changes: ${err?.message}`);
			}
		});
	}
}

const logWatcher = new MCLogWatcher();
logWatcher.subscribe("changes", defaultHandler);
logWatcher.watch();