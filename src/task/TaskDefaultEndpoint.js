const Task = require("../Task");

class TaskDefaultEndpoint extends Task {
	constructor(app, device, role) {
		super(app);

		this.device = device;
		this.role = role;
	}

	execute() {
		if(this.device.unknown) return;

		this.app.deviceManager.setDefaultEndpoint(
			this.device.id,
			this.role
		);
	}

	refresh() {
		this.device = this.app.deviceManager.findDeviceById(this.device.id, true);
	}

	static get type() {
		return "task.endpoint";
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
		const device = app.deviceManager.findDeviceById(taskObject.device, true);

		const task = new TaskEndpoint(app, device, taskObject.role);
		task.id = taskObject.id;

		return task;
	}
}

module.exports = TaskDefaultEndpoint;
