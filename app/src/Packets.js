class Packets {
	constructor({ipcRenderer}) {
		this.ipcRenderer = ipcRenderer;
	}

	sendPacket(name, payload) {
		return new Promise((resolve, reject) => {
			ipcRenderer.on(name, result => {
				if(!result.ok) return reject(result);
				resolve(result);
			});

			ipcRenderer.send(name, payload);
		});
	}
}

export default Packets;
