<template>
	<div class="SpTaskEndpoint">
		<h3>Set Default Endpoint</h3>

		<div class="SpTaskEndpoint__form">
			<div class="SpTaskEndpoint__device">
				<sp-device v-if="deviceId"
					:device="device" :removable="editing" :disable-select="!editing" minimal
					@select="setDevice(null)">

				</sp-device>

				<sp-placeholder v-else type="all" @device="setDevice"></sp-placeholder>
			</div>

			<div class="SpTaskEndpoint__label">
				as
			</div>

			<div class="SpTaskEndpoint__role">
				<sp-role-selector v-model="role" :default="{}" :as-is="!editing"></sp-role-selector>
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpTaskEndpoint {
		&__form {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&__device {
			flex-basis: 45%;
			min-width: 0;
		}

		&__label {
			font-size: 2rem;
			font-weight: 100;
		}

		&__role {
			flex-basis: 150px;
		}
	}
</style>

<script>
	import SpDevice from "../components/SpDevice.vue";
	import SpPlaceholder from "../components/SpPlaceholder.vue";
	import SpRoleSelector from "../components/SpRoleSelector.vue";

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
			deviceId: {
				get() {
					return this.task.device;
				},

				set(id) {
					this.$emit(
						'update',
						Object.assign({}, this.task, {device: id})
					);
				}
			},

			role: {
				get() {
					return this.task.role || {};
				},

				set(value) {
					let entries = Object.entries(value).filter(([k, v]) => v);
					const editedValue = entries.length > 0 ? Object.fromEntries(entries) : null;

					this.$emit(
						'update',
						Object.assign({}, this.task, {role: editedValue})
					);
				}
			},

			devices() {
				return this.$store.state.devices;
			},

			device() {
				return this.devices.find(({id}) => id === this.deviceId) || {
					type: 'unknown',
					name: 'Unknown Device',
					id,
					roles: {},
					type: null
				};
			},

			finished() {
				return !!this.task.device && !!this.task.role;
			}
		},

		methods: {
			setDevice(id) {
				if(this.editing) {
					this.deviceId = id;
				}
			}
		},

		components: {
			SpDevice,
			SpPlaceholder,
			SpRoleSelector
		},

		watch: {
			finished(newVal) {
				this.$emit('finish', newVal);
			}
		}
	};
</script>
