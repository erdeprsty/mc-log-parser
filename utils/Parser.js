class ArgumentParser {
	constructor() {
		this.optionArgs = {
			"log-path": null,
		};
	}
	parseArgString = (argString) => {
		const arg = {
			key: null,
			value: null,
		};
		if (typeof argString !== "string") return arg;
		if (!argString.startsWith("--")) return arg;
		let [argKey, argValue, ...restArgs] = argString.split(/=/);
		if (argKey) arg.key = argKey.slice(2);
		if (argValue) {
			const hasMutlipleEqualSign = restArgs.length > 0;
			if (hasMutlipleEqualSign) {
				const concatenatedArgs = `${argValue}=${restArgs.join("=")}`;
				arg.value = concatenatedArgs;
			} else {
				arg.value = argValue;
			}
		}
		return arg;
	};
	getValidOptionArgKeys = () => Object.keys(this.optionArgs);
	isValidOptionArgKey = (argKey) => {
		if (!argKey) return false;
		const validArgs = this.getValidOptionArgKeys();
		return validArgs.includes(argKey);
	};
	setOptionArg = (key, value) => {
		if (this.isValidOptionArgKey(key)) {
			this.optionArgs[key] = value;
		}
	};
	parse() {
		const args = process.argv.slice(2, process.argv.length);
		for (let arg of args) {
			const { key: argKey, value: argValue } = this.parseArgString(arg);
			this.setOptionArg(argKey, argValue);
		}
	}
}

class LogParser {
	constructor(name) {
		this.name = name;
	}
	parse() {
		throw new Error("Not implemented yet!");
	}
}

module.exports = {
	ArgumentParser,
	LogParser,
};
