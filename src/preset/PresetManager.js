const EventEmitter = require('events');
const Preset = require('./Preset');

class PresetManager extends EventEmitter {
	constructor(app) {
		super();

		this.app = app;
		this.presets = new Map();
	}

	findPresetsByShortcut(shortcut) {
		return Array.from(this.presets.values())
			.filter(preset => preset.shortcuts.includes(shortcut));
	}

	addPreset(preset) {
		this.presets.set(preset.id, preset);
		this.emit('addPreset', preset);
	}

	getPreset(presetId) {
		return this.presets.get(presetId);
	}

	removePreset(presetId) {
		this.presets.delete(presetId);
		this.emit('removePreset', presetId);
	}

	importPresets(presetsObject) {
		this.presets.clear();

		presetsObject.forEach(presetObject => {
			this.addPreset(Preset.importPreset(this.app, presetObject));
		});
	}

	refresh() {
		this.presets.forEach(preset => preset.refresh());
	}

	exportPresets() {
		return Array.from(this.presets.values()).map(preset => preset.exportPreset());
	}

	static importPresets(app, presetsObject) {
		const manager = new PresetManager(app);
		manager.importPresets(presetsObject);
	}
}

module.exports = PresetManager;
