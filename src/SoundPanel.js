const {app, globalShortcut, nativeImage, protocol} = require('electron');
const fs = require('fs');
const isDev = require('electron-is-dev');
const player = require('node-wav-player');
const path = require('path');
const registerPackets = require('./Packets');

const {BrowserWindow, Menu, Tray} = require('electron');
const Config = require('./Config');
const DeviceManager = require('./device/DeviceManager');
const PresetManager = require('./preset/PresetManager');
const ShortcutManager = require('./ShortcutManager');
const LoopedBack = require('looped-back');

class SoundPanel {
	constructor() {
		this.isDev = isDev;

		this.looped = new LoopedBack();
		this.deviceManager = new DeviceManager(this);
		this.presetManager = new PresetManager(this);
		this.shortcutManager = new ShortcutManager(this);
		this.configs = new Config(this);

		this.lastWriteRequest = 0;
		this.configPath = path.resolve(app.getPath('userData'), 'config.json');

		this.mainWindow = null;
		this.dialogWindow = null;

		this.notificationQueue = null;
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

		const args = process.argv.slice(this.isDev ? 2 : 1);

		await this.readPresets();

		registerPackets(this);

		this.registerProtocol();
		this.presetManager.presets.forEach(preset => {
			preset.checkIsActive();
			this.registerShortcut(preset.shortcuts);
		});

		if(this.configs.get('enableTray')) {
			const trayIcon = nativeImage.createFromPath(
				path.resolve(__dirname, '..', 'app', 'images', 'logo.png')
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

		app.on('will-quit', () => {
			this.looped.destroy();
			globalShortcut.unregisterAll();
		});

		app.on('window-all-closed', () => {});
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

	show() {
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
				
				if(this.configs.get('quitOnExit')) {
					this.beforeExit();
				}
			});

			this.mainWindow.loadURL('soundpanel://voltexpanel/');
			if(this.isDev) this.mainWindow.toggleDevTools();
		});
	}

	async showNotification(content) {
		await new Promise(resolve => {
			if(this.dialogWindow) return resolve();

			this.dialogWindow = new BrowserWindow({
				width: 300,
				height: 100,
				show: false,
				frame: false,
				transparent: true,
				type: 'notification',
				webPreferences: {
					nodeIntegration: true
				}
			});
			this.dialogWindow.setIgnoreMouseEvents(true);
			this.dialogWindow.setAlwaysOnTop(true);
			this.dialogWindow.isResizable(false);
			this.dialogWindow.setPosition(50, 50);

			this.dialogWindow.once('ready-to-show', () => {
				resolve();
			});

			this.dialogWindow.on('closed', () => {
				this.dialogWindow = null;
			});

			this.dialogWindow.loadURL('soundpanel://voltexpanel/dialog');
		});

		if (Array.isArray(this.notificationQueue)) {
			this.notificationQueue.push(content);
			return;
		}

		this.dialogWindow.show();
		this.notificationQueue = [ content ];

		while(this.notificationQueue.length > 0) {
			const item = this.notificationQueue.shift();
			this.dialogWindow.webContents.send('notification', { content: item });

			await new Promise(resolve => setTimeout(resolve, 4000));
		}
		this.notificationQueue = null;
		this.dialogWindow.hide();
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
		return this.shortcutManager.registerShortcut(shortcut);
	}

	unregisterShortcut(shortcut) {
		return this.shortcutManager.unregisterShortcut(shortcut);
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

	async notifyExecution(preset) {
		await player.play({
			path: this.configs.get('waveFile')
		}).catch(() => {});

		await this.showNotification(preset.name);
	}

	registerProtocol() {
		protocol.registerFileProtocol('soundpanel', (req, cb) => {
			const reqPath = req.url
				.replace(/^soundpanel:\/\/voltexpanel\/?/, '')
				.replace(/\?.*/, '')
				.replace(/\#.*/, '');

			const pathSplit = reqPath.split('/');

			if (pathSplit[0] === 'dist') {
				pathSplit.shift();
				cb(path.resolve(__dirname, '..', 'dist', ...pathSplit));
				return;
			}

			if (pathSplit[0] === 'dialog') {
				cb(path.resolve(__dirname, '..', 'views', 'dialog.html'));
				return;
			}

			cb(path.resolve(__dirname, '..', 'views', 'index.html'));
		});
	}
}

module.exports = SoundPanel;
