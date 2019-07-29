const {app, globalShortcut, protocol} = require('electron');
const path = require('path');
const registerPackets = require('./Packets');

const {BrowserWindow} = require('electron');
const DeviceManager = require('./device/DeviceManager');
const PresetManager = require('./preset/PresetManager');
const LoopedBack = require('looped-back');

class SoundPanel {
	constructor() {
		this.looped = new LoopedBack();
		this.deviceManager = new DeviceManager(this);
		this.presetManager = new PresetManager(this);

		this.lastWriteRequest = 0;
		this.configPath = path.resolve(app.getPath('userData'), 'config.json');

		this.mainWindow = null;
	}

	async init() {
		await this.readPresets();

		registerPackets(this);

		this.registerProtocol();
		this.presetManager.presets.forEach(preset => {
			this.registerShortcut(preset.shortcut);
		});

		app.on('window-all-closed', () => {
			this.beforeExit();
		});
	}

	async show() {
		return new Promise(resolve => {
			if(this.mainWindow) {
				this.mainWindow.focus();

				resolve();
				return;
			}

			this.mainWindow = new BrowserWindow({
				width: 1280,
				height: 720,
				minWidth: 640,
				minHeight: 360,
				show: false,
				frame: false,
				title: "SoundPanel",
				webPreferences: {
					nodeIntegration: true
				}
			});

			this.mainWindow.setMenu(null);

			this.mainWindow.once('ready-to-show', () => {
				this.mainWindow.show();
				resolve();
			});

			this.mainWindow.on('closed', () => {
				this.mainWindow = null;
			});

			this.mainWindow.loadURL('soundpanel://voltexpanel/');
			this.mainWindow.toggleDevTools();
		});
	}


	async beforeExit() {
		await this.writePresets();
		globalShortcut.unregisterAll();

		if(this.mainWindow) this.mainWindow.close();
		app.quit();
	}

	async readPresets() {
		try {
			const rawPreset = await fs.promises.readFile(this.configPath, 'utf-8');
			const presetsObject = JSON.parse(rawPreset);
			this.presetManager.importPresets(presetsObject);
		} catch(e) {

		}
	}

	registerShortcut(shortcut) {
		if(Array.isArray(shortcut)) {
			if(shortcut.length === 0) return;

			return globalShortcut.registerAll(
				shortcut, () => this.presetManager.findPresetByShortcut(shortcut[0]).execute()
			);
		}

		return globalShortcut.register(
			shortcut, () => this.presetManager.findPresetByShortcut(shortcut).execute()
		);
	}

	unregisterShortcut(shortcut) {
		globalShortcut.unregister(shortcut);
	}

	requestWritePresets() {
		const timestamp = Date.now();
		this.lastWriteRequest = timestamp;

		setTimeout(() => {
			if(this.lastWriteRequest === timestamp) this.writePresets();
		}, 1000);
	}

	async writePresets() {
		try {
			const rawPreset = JSON.stringify(this.presetManager.exportPresets());
			await fs.promises.writeFile(this.configPath, rawPreset);
		} catch(e) {

		}
	}

	registerProtocol() {
		protocol.registerFileProtocol('soundpanel', (req, cb) => {
			const reqPath = req.url
				.replace(/^soundpanel:\/\/voltexpanel\/?/, '')
				.replace(/\?.*/, '')
				.replace(/\#.*/, '');

			const pathSplit = reqPath.split('/');

			if(pathSplit[0] === 'dist') {
				pathSplit.shift();
				cb(path.resolve(__dirname, '..', 'dist', ...pathSplit));
				return;
			}

			cb(path.resolve(__dirname, '..', 'index.html'));
		});
	}
}

module.exports = SoundPanel;
