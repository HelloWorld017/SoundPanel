<template>
	<div class="SpPreset">
		<h1>
			Preset:
			<span v-if="!editMode" class="SpPreset__name">{{preset.name}}</span>
			<input v-else
				type="text" class="SpPreset__nameedit"
				v-model="name" ref="editText"
				@blur="updateName">

			<a class="SpPreset__edit" @click="setEditMode">
				<i class="mdi mdi-pencil"></i>
			</a>

			<sp-hold-button class="SpPreset__delete" @hold="remove">
				<i class="mdi mdi-delete"></i>
			</sp-hold-button>
		</h1>

		<div class="SpPreset__shortcuts">
			<sp-keys :keys="preset.shortcuts" @add="addShortcut" @remove="removeShortcut"></sp-keys>
		</div>

		<transition-group class="SpPreset__tasks" name="ListFade" tag="div">
			<sp-task class="SpPreset__task" v-for="(task, index) in preset.tasks"
				:key="task.id" @remove="removeTask(task.id)" removable>

				<h3>Task #{{index}}</h3>
				<component class="SpPreset__task__content" :is="getTaskByTaskID(task.type)" :task="task"></component>
			</sp-task>

			<sp-task class="SpPreset__task SpPreset__task--edit" v-if="editingTask" key="NewTask">
				<sp-task-new v-model="editingTask" @apply="finishNewTask" @cancel="cancelNewTask"></sp-task-new>
			</sp-task>

			<sp-task class="SpPreset__task SpPreset__task--add" @click="startNewTask" v-else key="NewTaskButton">
				<i class="mdi mdi-plus"></i> New Task
			</sp-task>
		</transition-group>
	</div>
</template>

<style lang="less" scoped>
	.SpPreset {
		padding: 20px;
		box-sizing: border-box;
		overflow: auto;

		h1 {
			font-family: 'Fira Sans', sans-serif;
			font-weight: 300;
			margin-top: 20px;
			margin-bottom: 10px;
		}

		&__name {
			font-weight: 600;
		}

		&__edit {
			cursor: pointer;
			color: #808080;
			font-size: 1.5rem;
			margin-left: 15px;
		}

		&__delete {
			color: #404040;
			font-size: 1.5rem;
		}

		&__nameedit {
			font-family: 'Noto Sans KR', sans-serif;
			font-size: 1.2rem;
			padding: 5px 10px;
			background: transparent;
			border: none;
			border-bottom: 2px solid #202020;
			outline: none;

			&::selection {
				background: #202020;
				color: #f1f2f3;
			}
		}

		&__tasks {
			position: relative;
		}

		&__task {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			box-sizing: border-box;
			margin-top: 20px;

			h3 {
				margin: 0;
				font-weight: 400;
			}

			&--add {
				cursor: pointer;
				flex-direction: row;
				align-items: center;
			}

			&__content {
				padding-left: 20px;
			}
		}
	}
</style>

<script>
	import SpHoldButton from "../components/SpHoldButton.vue";
	import SpKeys from "../components/SpKeys.vue";
	import SpTask from "../components/SpTask.vue";
	import SpTaskNew from "./SpTaskNew.vue";

	import {getTaskByTaskID} from "../src/TaskLayout";

	export default {
		data() {
			return {
				editMode: false,
				name: '',
				editingTask: null
			};
		},

		props: {
			preset: {
				type: Object,
				required: true
			}
		},

		methods: {
			async remove() {
				await $soundpanel.packets.sendPacket('presetManager.removePreset', {id: this.preset.id});

				this.$emit('refresh');
			},

			async addShortcut(key) {
				await $soundpanel.packets.sendPacket(
					'preset.addShortcut',
					{id: this.preset.id, shortcut: key.replace(/ /g, '')}
				);

				this.$emit('refresh');
			},

			async removeShortcut(key) {
				await $soundpanel.packets.sendPacket(
					'preset.removeShortcut',
					{id: this.preset.id, shortcut: key}
				);

				this.$emit('refresh');
			},

			setEditMode() {
				this.name = this.preset.name;
				this.editMode = true;
				this.$nextTick(() => {
					this.$refs.editText.focus();
				});
			},

			async updateName() {
				await $soundpanel.packets.sendPacket(
					'preset.setName',
					{id: this.preset.id, name: this.name}
				);

				this.$emit('refresh');
				this.editMode = false;
			},

			startNewTask() {
				this.editingTask = {};
			},

			async finishNewTask() {
				await $soundpanel.packets.sendPacket('preset.addTask', {
					id: this.preset.id,
					task: this.editingTask
				});

				this.$emit('refresh');
				this.editingTask = null;
			},

			cancelNewTask() {
				this.editingTask = null;
			},

			async removeTask(id) {
				await $soundpanel.packets.sendPacket('preset.removeTask', {
					id: this.preset.id,
					taskId: id
				});

				this.$emit('refresh');
			},

			getTaskByTaskID
		},

		components: {
			SpHoldButton,
			SpKeys,
			SpTask,
			SpTaskNew
		}
	};
</script>
