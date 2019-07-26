const {getTaskByType} = require('../task');
const uuidv4 = require('uuid/v4');

const Task = require('../task/Task');

class Preset {
	constructor(app, name) {
		this.id = `Preset/${uuidv4()}`;
		this.app = app;
		this.name = name;
		this.tasks = new Map();
		this.shortcuts = [];
	}

	addShortcut(shortcut) {
		const shortcutExists = app.presetManager.findPresetByShortcut(shortcut);
		if(shortcutExists) {
			return false;
		}

		this.shortcuts.push(shortcut);
		this.app.addShortcut(shortcut);
		return true;
	}

	removeShortcut(shortcut) {
		const shortcutIndex = this.shortcuts.findIndex(v => v === shortcut);
		if(shortcutIndex >= 0) {
			this.shortcuts.splice(shortcutIndex, 1);
			this.app.unregisterShortcut(shortcut);
			return true;
		}

		return false;
	}

	addTask(task) {
		this.tasks.set(task.id, task);
	}

	addTaskFromObject(taskObject) {
		const {type} = taskObject;
		const TaskClass = getTaskByType(type);
		if(!(TaskClass instanceof Task)) {
			return false;
		}

		const task = TaskClass.importTask(app, taskObject);
		this.addTask(task);

		return true;
	}

	removeTask(taskId) {
		this.tasks.delete(taskId);
	}

	setName(name) {
		this.name = name;
	}

	execute() {
		this.tasks.forEach(task => task.execute());
		this.playExecuteSound();
	}

	playExecuteSound() {
		//TODO 
	}

	refresh() {
		this.tasks.forEach(task => task.refresh());
	}

	exportPreset() {
		return {
			type: 'preset',
			id: this.id,
			name: this.name,
			tasks: Array.from(this.tasks.values()).map(task => task.exportTask()),
			shortcuts: this.shortcuts
		};
	}

	static importPreset(app, presetObject) {
		const preset = new Preset(app, presetObject.name);
		preset.id = presetObject.id;
		preset.shortcuts = presetObject.shortcuts;
		presetObject.tasks.forEach(taskObject => {
			this.addTaskFromObject(taskObject);
		});

		return preset;
	}
}

module.exports = Preset;
