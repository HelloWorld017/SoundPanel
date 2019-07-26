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

		<div class="SpPreset__tasks">
			<sp-task v-for="task in preset.tasks" :task="task" :key="task.id"></sp-task>

			<a class="SpPreset__task SpPreset__task--add" @click="newTask">
				<i class="mdi mdi-plus"></i> New Task
			</a>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpPreset {
		padding: 20px;
		box-sizing: border-box;

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
			border: none;
			border-bottom: 2px solid #202020;
			outline: none;

			&::selection {
				background: #202020;
				color: #f1f2f3;
			}
		}
	}
</style>

<script>
	import SpHoldButton from "../components/SpHoldButton.vue";
	import SpKeys from "../components/SpKeys.vue";

	export default {
		data() {
			return {
				editMode: false,
				name: ''
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
				await $soundpanel.packets.sendPacket('presetManager.removePreset')
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

			newTask() {

			}
		},

		components: {
			SpHoldButton,
			SpKeys
		}
	};
</script>
