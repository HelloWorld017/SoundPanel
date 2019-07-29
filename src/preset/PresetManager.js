const Preset = require('./Preset');

class PresetManager {
	constructor(app) {
		this.app = app;
		this.presets = new Map();
	}

	findPresetByShortcut(shortcut) {
		return Array.from(this.presets.values())
			.find(preset => preset.shortcuts.includes(shortcut));
	}

	addPreset(preset) {
		this.presets.set(preset.id, preset);
	}

	getPreset(presetId) {
		return this.presets.get(presetId);
	}

	removePreset(presetId) {
		this.presets.delete(presetId);
	}

	importPresets(presetsObject) {
		this.presets.clear();

		presetsObject.forEach(presetObject => {
			manager.addPreset(Preset.importPreset(presetObject));
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
