const Task = require("../Task");

class TaskLoopback extends Task {
	constructor(app, source, target) {
		super(app);

		this.sourceDevice = source;
		this.targetDevice = target;
	}

	execute() {
		if(this.sourceDevice.unknown || this.targetDevice.unknown) return;

		this.app.deviceManager.setLoopback(
			this.sourceDevice.id,
			this.targetDevice.id
		);
	}

	refresh() {
		this.sourceDevice = this.app.deviceManager.findDeviceById(this.sourceDevice.id, true);
		this.targetDevice = this.app.deviceManager.findDeviceById(this.targetDevice.id, true);
	}

	static get type() {
		return "task.loopback";
	}

	exportTask() {
		return {
			type: this.type,
			id: this.id,
			device: this.device.id,
			role: this.role
		};
	}

	static importTask(app, taskObject) {
		const source = app.deviceManager.findDeviceById(taskObject.source, true);
		const target = app.deviceManager.findDeviceById(taskObject.target, true);

		const task = new TaskLoopback(app, source, target);
		task.id = taskObject.id;

		return task;
	}
}

module.exports = TaskLoopback;
