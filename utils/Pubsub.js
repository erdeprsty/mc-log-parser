class PubSub {
	constructor() {
		this.events = {};
	}
	subscribe(name, handler) {
		if (this.events.hasOwnProperty(name)) {
			this.events[name].push(handler);
			return this;
		}
		this.events[name] = [handler];
		return this;
	}
	unsubscribe(name, handler) {
		if (this.events.hasOwnProperty(name)) {
			const matchedIndex = this.events[name].findIndex(
				(eventHandler) => eventHandler === handler
			);
			if (matchedIndex > -1) this.events[name].splice(matchedIndex, 1);
		}
	}
	publish(name, data = null) {
		if (this.events.hasOwnProperty(name)) {
			for (const handler of this.events[name]) {
				try{
					handler(data);
				}catch(err){
					console.log(`[ERROR] Pubsub error while executing event: ${err?.message}`)
				}
			}
		}
		return this;
	}
}

module.exports = PubSub;
