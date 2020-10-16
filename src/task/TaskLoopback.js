const Task = require("./Task");

class TaskLoopback extends Task {
	constructor(app, source, target) {
		super(app);

		this.sourceDevice = source;
		this.targetDevice = target;
	}

	execute() {
		if (this.sourceDevice.unknown || (this.targetDevice && this.targetDevice.unknown)) return;

		this.app.deviceManager.setLoopback(
			this.sourceDevice.id,
			this.targetDevice && this.targetDevice.id
		);
	}

	isActive() {
		if (this.sourceDevice.unknown) return true;
		if (this.targetDevice && this.targetDevice.unknown) return false;

		const loopback = this.app.deviceManager.getLoopback(this.sourceDevice.id);
		if (!this.targetDevice)
			return !loopback;

		return loopback && loopback.id === this.targetDevice.id;
	}

	refresh() {
		this.sourceDevice = this.app.deviceManager.findDeviceById(this.sourceDevice.id, true);
		this.targetDevice = this.targetDevice && this.app.deviceManager.findDeviceById(this.targetDevice.id, true);
	}

	static get type() {
		return "task.loopback";
	}

	exportTask() {
		return {
			type: this.type,
			id: this.id,
			source: this.sourceDevice.id,
			target: this.targetDevice && this.targetDevice.id
		};
	}

	static importTask(app, taskObject) {
		const source = app.deviceManager.findDeviceById(taskObject.source, true);
		const target = taskObject.target && app.deviceManager.findDeviceById(taskObject.target, true);

		const task = new TaskLoopback(app, source, target);
		if(taskObject.id) task.id = taskObject.id;

		return task;
	}
}

module.exports = TaskLoopback;
