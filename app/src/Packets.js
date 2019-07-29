class Packets {
	constructor({ipcRenderer}) {
		this.ipcRenderer = ipcRenderer;
	}

	sendPacket(name, payload) {
		return new Promise((resolve, reject) => {
			const reqId = Math.random().toString(36).slice(2);

			console.log(`Request: ${name}, id: ${reqId}`, payload);

			this.ipcRenderer.once(name, (sender, result) => {
				console.log(`Response: ${name}, id: ${reqId}`, result);

				if(!result.ok) return reject(result);
				resolve(result);
			});

			this.ipcRenderer.send(name, payload);
		});
	}
}

export default Packets;
