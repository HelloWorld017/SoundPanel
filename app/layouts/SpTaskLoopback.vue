<template>
	<div class="SpTaskLoopback">
		<h3>Set Loopback Device</h3>

		<div class="SpTaskLoopback__form">
			<div class="SpTaskLoopback__device">
				<sp-device v-if="sourceDeviceId"
					:device="sourceDevice" :removable="editing" :disable-select="!editing" minimal
					@select="setSourceDevice(null)">

				</sp-device>

				<sp-placeholder v-else type="capture" @device="setSourceDevice"></sp-placeholder>
			</div>

			<div class="SpTaskLoopback__label">
				<loopback-icon></loopback-icon>
			</div>

			<div class="SpTaskLoopback__device">
				<sp-device v-if="targetDeviceId"
					:device="targetDevice" :removable="editing" :disable-select="!editing" minimal
					@select="setTargetDevice(null)">

				</sp-device>

				<sp-placeholder v-else type="render" @device="setTargetDevice"></sp-placeholder>
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpTaskLoopback {
		&__form {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&__device {
			flex: 1;
		}

		&__label {
			padding: 0 10px;
		}
	}
</style>

<script>
	import LoopbackIcon from "../images/LoopbackIcon.svg?component";
	import SpDevice from "../components/SpDevice.vue";
	import SpPlaceholder from "../components/SpPlaceholder.vue";

	export default {
		model: {
			prop: 'task',
			event: 'update'
		},

		props: {
			editing: Boolean,
			task: {
				type: Object,
				required: true
			}
		},

		computed: {
			devices() {
				return this.$store.state.devices;
			},

			sourceDevice() {
				return this.devices.find(({id}) => id === this.sourceDeviceId) || this.unknownDevice();
			},

			targetDevice() {
				return this.devices.find(({id}) => id === this.targetDeviceId) || this.unknownDevice();
			},

			sourceDeviceId: {
				get() {
					return this.task.source;
				},

				set(id) {
					this.$emit(
						'update',
						Object.assign({}, this.task, {source: id})
					);
				}
			},

			targetDeviceId: {
				get() {
					return this.task.target;
				},

				set(id) {
					this.$emit(
						'update',
						Object.assign({}, this.task, {target: id})
					);
				}
			},

			finished() {
				return !!this.task.source && !!this.task.target;
			}
		},

		methods: {
			unknownDevice() {
				return {
					type: 'unknown',
					name: 'Unknown Device',
					id,
					roles: {},
					type: null
				};
			},

			setSourceDevice(id) {
				if(this.editing) this.sourceDeviceId = id;
			},

			setTargetDevice(id) {
				if(this.editing) this.targetDeviceId = id;
			}
		},

		components: {
			LoopbackIcon,
			SpDevice,
			SpPlaceholder
		},

		watch: {
			finished(newVal) {
				if(this.editing) this.$emit('finish', newVal);
			}
		}
	};
</script>
