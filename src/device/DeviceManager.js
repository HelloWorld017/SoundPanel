const Device = require('./Device');
const LoopedBack = require('looped-back');

const roles = [LoopedBack.ROLE_CONSOLE, LoopedBack.ROLE_MULTIMEDIA, LoopedBack.ROLE_COMMUNICATION];
const types = [LoopedBack.DEVICE_RENDER, LoopedBack.DEVICE_CAPTURE];

class DeviceManager {
	constructor(app) {
		this.app = app;
		this.devices = new Map();
		this.refresh();
	}

	findDeviceById(id, returnUnknown = false) {
		if(this.devices.has(id)) {
			return this.devices.get(id);
		}

		if(returnUnknown)
			return new Device(id, 'Unknown Device', null, true);

		return null;
	}

	getLoopback(sourceId) {
		const sourceDevice = this.findDeviceById(sourceId);
		if(!sourceDevice || sourceDevice.type !== LoopedBack.DEVICE_CAPTURE) return null;

		return this.findDeviceById(this.app.looped.getLoopback(sourceId));
	}

	setLoopback(sourceId, targetId) {
		const sourceDevice = this.findDeviceById(sourceId);
		const targetDevice = this.findDeviceById(targetId);

		if(
			!sourceDevice || sourceDevice.type !== LoopedBack.DEVICE_CAPTURE ||
			!targetDevice || targetDevice.type !== LoopedBack.DEVICE_RENDER
		) {
			return false;
		}

		const result = this.app.looped.setLoopback(sourceId, targetId);

		if(!result) return false;

		sourceDevice.loopback = targetId;
		return true;
	}

	getDefaultEndpoint(type, role) {
		if(!types.includes(type)) return null;
		if(!roles.includes(role)) return null;

		return this.findDeviceById(this.app.looped.getDefaultEndpoint(type)[role]);
	}

	getDefaultEndpoints(type) {
		if(!types.includes(type)) return {};

		const endpointIds = this.app.looped.getDefaultEndpoint(type);
		const endpointDevices = {};
		for (const role of endpointIds) {
			endpointDevices[role] = this.findDeviceById(endpointIds[role]);
		}

		return endpointDevices;
	}

	setDefaultEndpoint(deviceId, role) {
		if(!roles.includes(role)) return false;

		const device = this.findDeviceById(deviceId);
		if(!device) return false;

		if(device.hasRole(role)) return true;

		const originalDevice = Array.from(this.devices.values).find(
			v => v.type === device.type && v.hasRole(role)
		);

		const result = this.app.looped.setDefaultEndpoint(deviceId, role);
		if(!result) return false;

		originalDevice.removeRole(role);
		device.addRole(role);

		return true;
	}

	refresh() {
		this.devices.clear();

		types.forEach(type => {
			const devices = this.app.looped.getDevices(type);
			const defaults = this.app.looped.getDefaultEndpoint(type);

			devices.forEach(deviceObj => {
				const device = new Device(deviceObj.id, deviceObj.name, type);
				roles.forEach(role => {
					if(defaults[role] === device.id) {
						device.addRole(role);
					}
				});

				if(type === LoopedBack.DEVICE_CAPTURE) {
					device.loopback = this.app.looped.getLoopback(device.id);
				}

				this.devices.set(device.id, device);
			});
		});
	}

	exportDevices() {
		return {
			types: {
				capture: LoopedBack.DEVICE_CAPTURE,
				render: LoopedBack.DEVICE_RENDER
			},

			roles: {
				console: LoopedBack.ROLE_CONSOLE,
				multimedia: LoopedBack.ROLE_MULTIMEDIA,
				communication: LoopedBack.ROLE_COMMUNICATION
			},

			devices: JSON.parse(JSON.stringify(Array.from(this.devices.values())))
		};
	}
}

module.exports = DeviceManager;
