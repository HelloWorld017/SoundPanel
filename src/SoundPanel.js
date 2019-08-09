const {app, globalShortcut, nativeImage, protocol} = require('electron');
const fs = require('fs');
const isDev = require('electron-is-dev');
const path = require('path');
const registerPackets = require('./Packets');

const {BrowserWindow, Menu, Tray} = require('electron');
const Config = require('./Config');
const DeviceManager = require('./device/DeviceManager');
const PresetManager = require('./preset/PresetManager');
const LoopedBack = require('looped-back');

class SoundPanel {
	constructor() {
		this.looped = new LoopedBack();
		this.deviceManager = new DeviceManager(this);
		this.presetManager = new PresetManager(this);
		this.configs = new Config(this);

		this.lastWriteRequest = 0;
		this.configPath = path.resolve(app.getPath('userData'), 'config.json');

		this.mainWindow = null;
	}

	async init() {
		const shouldQuit = app.requestSingleInstanceLock();
		if(!shouldQuit) {
			app.quit();
			return;
		}

		app.on('second-instance', async () => {
			if(!this.mainWindow) await this.show();

			if(this.mainWindow.minimized) this.mainWindow.restore();
			this.mainWindow.focus();
		});

		const args = process.argv.slice(isDev ? 2 : 1);

		await this.readPresets();

		registerPackets(this);

		this.registerProtocol();
		this.presetManager.presets.forEach(preset => {
			this.registerShortcut(preset.shortcuts);
		});

		if(this.configs.get('enableTray')) {
			const trayIcon = nativeImage.createFromPath(
				path.resolve(__dirname, '..', 'app', 'images', 'SoundPanelLogo.png')
			);

			this.tray = new Tray(trayIcon);
			this.tray.setToolTip('SoundPanel');
			this.tray.on('click', () => {
				this.show();
			});

			this.updateMenu();

			this.presetManager.on('addPreset', () => this.updateMenu());
			this.presetManager.on('removePreset', () => this.updateMenu());
		}

		if(!args.includes('--minimized')) {
			await this.show();
		}

		app.on('window-all-closed', () => {
			if(this.configs.get('quitOnExit')) this.beforeExit();
		});

		app.on('will-quit', () => {
			this.looped.destroy();
			globalShortcut.unregisterAll();
		});
	}

	updateMenu() {
		if(!this.tray) return;

		const trayPresets = [];
		this.presetManager.presets.forEach(preset => {
			trayPresets.push({
				label: preset.name,
				click: () => {
					preset.execute();
				}
			});
		});

		this.tray.setContextMenu(
			Menu.buildFromTemplate([
				...trayPresets,

				{ type: 'separator' },

				{
					label: 'Open',
					click: () => {
						this.show();
					}
				},

				{
					label: 'Exit',
					click: () => {
						this.beforeExit();
					}
				}
			])
		);
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

			this.mainWindow.removeMenu();

			this.mainWindow.once('ready-to-show', () => {
				this.mainWindow.show();
				resolve();
			});

			this.mainWindow.on('closed', () => {
				this.mainWindow = null;
			});

			this.mainWindow.loadURL('soundpanel://voltexpanel/');
			if(isDev) this.mainWindow.toggleDevTools();
		});
	}


	async beforeExit() {
		await this.writePresets();

		if(this.mainWindow) this.mainWindow.close();
		app.quit();
	}

	async readPresets() {
		try {
			const rawPreset = await fs.promises.readFile(this.configPath, 'utf-8');
			const {configs, presets: presetsObject} = JSON.parse(rawPreset);
			this.configs.importConfigs(configs);
			this.presetManager.importPresets(presetsObject);
		} catch(e) {
			console.error(e);
		}
	}

	registerShortcut(shortcut) {
		if(Array.isArray(shortcut)) {
			if(shortcut.length === 0) return;

			// globalShortcut.registerAll doesn't work
			return shortcut.forEach(sc => {
				this.registerShortcut(sc);
			});
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
			const rawPreset = JSON.stringify({
				configs: this.configs.exportConfigs(),
				presets: this.presetManager.exportPresets()
			});
			await fs.promises.writeFile(this.configPath, rawPreset);
		} catch(e) {
			console.error(e);
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
