const {app: electronApp} = require('electron');

class Config {
	constructor(app) {
		this.app = app;
		this.configs = {
			enableTray: true,
			quitOnExit: false,
			waveFile: './app/audio/notify.wav',
			notifyAtExecute: true
		};

		this.computed = {
			runOnStartup: {
				get() {
					return electronApp.getLoginItemSettings().openAtLogin;
				},

				set(value) {
					electronApp.setLoginItemSettings({
						openAtLogin: value,
						args: ['--minimized']
					});
				}
			}
		};
	}

	get(key) {
		if(this.computed[key]) return this.computed[key];
		return this.configs[key];
	}

	set(key, value) {
		if(this.computed[key]) {
			this.computed[key].set(value);
			return;
		}

		this.configs[key] = value;
		this.save();
	}

	save() {
		this.app.requestWritePresets();
	}

	importConfigs(configs) {
		this.configs = Object.assign({}, this.configs, configs);
	}

	exportConfigs() {
		return this.configs;
	}

	exportConfigsComputed() {
		const newConfig = Object.assign({}, this.configs);

		for (let key in this.computed) {
			newConfig[key] = this.computed[key].get();
		}

		return newConfig;
	}

	static importConfigs(configObject) {
		const config = new Config();
		config.importConfigs(configObject);

		return config;
	}
}

module.exports = Config;
