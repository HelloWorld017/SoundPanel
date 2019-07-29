<template>
	<div class="SpTaskNew">
		<div class="SpTaskNew__header">
			<h3>New Task</h3>

			<sp-chooser class="SpTaskNew__chooser" v-model="type">
				<option value='' selected disabled>Task Type</option>
				<option value="task.endpoint">Set Endpoint</option>
				<option value="task.loopback">Set Loopback Device</option>
			</sp-chooser>
		</div>

		<div class="SpTaskNew__content">
			<component :is="getTaskByTaskID(type)" v-model="_task" @finish="setFinished" editing></component>
		</div>

		<div class="SpTaskNew__footer">
			<sp-button @click="finish" :disabled="!finished" primary>
				Create
			</sp-button>

			<sp-button @click="cancel">
				Cancel
			</sp-button>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpTaskNew {
		flex: 1;

		h3 {
			font-weight: 400;
			margin: 0;
		}

		&__content {
			padding-left: 10px;
		}

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__footer {
			display: flex;
			margin-top: 30px;
			justify-content: flex-end;
		}
	}
</style>

<script>
	import {getTaskByTaskID} from "../src/TaskLayout";

	import SpButton from "../components/SpButton.vue";
	import SpChooser from "../components/SpChooser.vue";

	export default {
		data() {
			return {
				finished: false
			};
		},

		model: {
			prop: 'task',
			event: 'update'
		},

		props: {
			task: {
				type: Object,
				required: true
			}
		},

		computed: {
			type: {
				get() {
					return this.task.type || '';
				},

				set(newType) {
					this.finished = false;
					this.$emit(
						'update',
						{type: newType}
					);
				}
			},

			_task: {
				get() {
					return this.task;
				},

				set(newTask) {
					this.$emit(
						'update',
						newTask
					);
				}
			}
		},

		methods: {
			getTaskByTaskID,

			finish() {
				this.$emit('apply');
			},

			cancel() {
				this.$emit('cancel');
			},

			setFinished(value) {
				this.finished = value;
			}
		},

		components: {
			SpButton,
			SpChooser
		}
	};
</script>
