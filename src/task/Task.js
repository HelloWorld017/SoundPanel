const uuidv4 = require('uuid/v4');

class Task {
	constructor(app) {
		this.app = app;
		this.type = this.constructor.type;
		this.id = `Task/${uuidv4()}`;
	}

	execute() {}
	refresh() {}

	exportTask() {
		return {};
	}

	static get type() {
		return "";
	}

	static importTask() {
		return null;
	}
}

module.exports = Task;
