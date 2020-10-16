const { globalShortcut } = require('electron');

class ShortcutManager {
	constructor(app) {
		this.app = app;
		this.shortcuts = new Map();
		this.disabledBy = null;
		this.prevented = false;
	}

	disableShortcut(sender) {
		if (this.disabledBy) {
			this.enableShortcut();
		}

		this.disabledBy = sender;
	}

	enableShortcut(result = null) {
		if (this.disabledBy) {
			this.disabledBy.send('shortcutManager.interrupt', {
				ok: true,
				result
			});
		}

		this.disabledBy = null;
		this.preventForWhile();
	}

	preventForWhile(duration = 1500) {
		const key = `Prevented__${Math.random().toString(36).slice(2)}`;
		this.prevented = key;

		setTimeout(() => {
			if (this.prevented === key) {
				this.prevented = false;
			}
		}, duration);
	}

	handleShortcut(shortcut) {
		return () => {
			if (this.disabledBy) {
				this.enableShortcut(shortcut);
				return;
			}

			if (this.prevented) return;

			const presets = this.app.presetManager.findPresetsByShortcut(shortcut);
			if (presets.length === 0) {
				return;
			}

			const lastExecution = presets.reduce((prev, curr) => {
				if (prev.lastActive <= curr.lastActive) return curr;
				return prev;
			});

			const lastExecutionIndex = presets.indexOf(lastExecution);
			const nextExecution = presets[(lastExecutionIndex + 1) % presets.length];
			nextExecution.execute();

			this.preventForWhile();
		};
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
			shortcut, this.handleShortcut(shortcut)
		);
	}

	unregisterShortcut(shortcut) {
		globalShortcut.unregister(shortcut);
	}
}

module.exports = ShortcutManager;
