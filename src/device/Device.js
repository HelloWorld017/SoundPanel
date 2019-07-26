class Device {
	constructor(id, name, type, unknown = false) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.unknown = unknown;

		this.roles = {};
		this.loopback = null;
	}

	addRole(role) {
		this.roles[role] = true;
	}

	hasRole(role) {
		return !!this.roles[role];
	}
	
	removeRole(role) {
		delete this.roles[role];
	}
}

module.exports = Device;
