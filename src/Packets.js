const Preset = require('./preset/Preset');
const {ipcMain} = require('electron');

export default function registerPackets(app) {
	ipcMain.on('app.refresh', ({sender}) => {
		app.deviceManager.refresh();
		app.presetManager.refresh();

		sender.send('app.refresh', {
			ok: true
		});
	});

	ipcMain.on('presetManager.getPresets', ({sender}) => {
		sender.send('presetManager.getPresets', {
			ok: true,
			presets: app.presetManager.exportPresets()
		});
	});

	ipcMain.on('presetManager.newPreset', ({sender}) => {
		const preset = new Preset(app, 'New Preset');
		app.presetManager.addPreset(preset);
		app.requestWritePresets();

		sender.send('presetManager.newPreset', {
			ok: true,
			preset: preset
		});
	});

	ipcMain.on('presetManager.removePreset', ({sender}, {id}) => {
		app.presetManager.removePreset(id);
		app.requestWritePresets();

		sender.send('presetManager.removePreset', {
			ok: true
		});
	});

	ipcMain.on('preset.setName', ({sender}, {id, name}) => {
		const preset = app.presetManager.getPreset(id);
		if(!preset) return sender.send('preset.setName', {
				ok: false
			});

		preset.setName(name);
		app.requestWritePresets();

		sender.send('preset.setName', {
			ok: true
		});
	});

	ipcMain.on('preset.addTask', ({sender}, {id, task}) => {
		const preset = app.presetManager.getPreset(id);
		if(!preset) return sender.send('preset.addTask', {
				ok: false
			});

		const result = preset.addTaskFromObject(task);
		app.requestWritePresets();

		sender.send('preset.addTask', {
			ok: result
		});
	});

	ipcMain.on('preset.removeTask', ({sender}, {id, taskId}) => {
		const preset = app.presetManager.getPreset(id);
		if(!preset) return sender.send('preset.removeTask', {
				ok: false
			});

		preset.removeTask(taskId);
		app.requestWritePresets();

		sender.send('preset.removeTask', {
			ok: true
		});
	});

	ipcMain.on('preset.addShortcut', ({sender}, {id, shortcut}) => {
		const preset = app.presetManager.getPreset(id);
		if(!preset) return sender.send('preset.addShortcut', {
				ok: false
			});

		const result = preset.addShortcut(shortcut);
		app.requestWritePresets();

		sender.send('preset.addShortcut', {
			ok: result
		});
	});

	ipcMain.on('preset.removeShortcut', ({sender}, {id, shortcut}) => {
		const preset = app.presetManager.getPreset(id);
		if(!preset) return sender.send('preset.removeShortcut', {
				ok: false
			});

		const result = preset.removeShortcut(shortcut);
		app.requestWritePresets();

		sender.send('preset.removeShortcut', {
			ok: result
		});
	});

	ipcMain.on('deviceManager.getDevices', ({sender}) => {
		sender.send('deviceManager.getDevices', {
			ok: true,
			devices: app.deviceManager.exportDevices()
		});
	});

	ipcMain.on('deviceManager.refresh', ({sender}) => {
		app.deviceManager.refresh();

		sender.send('deviceManager.refresh', {
			ok: true
		});
	});

	ipcMain.on('deviceManager.setLoopback', ({sender}, {id, loopbackId}) => {
		const result = app.deviceManager.setLoopback(id, loopbackId);

		sender.send('device.setLoopback', {
			ok: result,
			result: app.deviceManager.exportDevices()
		});
	});

	ipcMain.on('deviceManager.setRole', ({sender}, {id, role}) => {
		const result = app.deviceManager.setDefaultEndpoint(id, role);

		sender.send('device.setRole', {
			ok: result,
			result: app.deviceManager.exportDevices()
		});
	});
};
