class Packets {
	constructor({ipcRenderer}) {
		this.ipcRenderer = ipcRenderer;
	}

	sendPacket(name, payload) {
		return new Promise((resolve, reject) => {
			this.ipcRenderer.once(name, (sender, result) => {
				if(!result.ok) return reject(result);
				resolve(result);
			});

			this.ipcRenderer.send(name, payload);
		});
	}
}

export default Packets;
