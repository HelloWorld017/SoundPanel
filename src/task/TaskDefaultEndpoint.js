const Task = require("./Task");

class TaskDefaultEndpoint extends Task {
	constructor(app, device, role) {
		super(app);

		this.device = device;
		this.role = role;
	}

	execute() {
		if(this.device.unknown) return;

		for(let key in this.role) {
			if(this.role[key]) {
				this.app.deviceManager.setDefaultEndpoint(
					this.device.id,
					key
				);
			}
		}
	}

	isActive() {
		if(this.device.unknown) return true;

		const endpointDevices = this.app.deviceManager.getDefaultEndpoints(this.device.type);

		const targetEndpointDevices = Object.keys(this.role)
			.filter(key => this.role[key])
			.map(role => endpointDevices[role]);

		return targetEndpointDevices.length > 0 &&
			targetEndpointDevices.every(device => device.id === this.device.id);
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

		const task = new TaskDefaultEndpoint(app, device, taskObject.role);
		task.id = taskObject.id;

		return task;
	}
}

module.exports = TaskDefaultEndpoint;
