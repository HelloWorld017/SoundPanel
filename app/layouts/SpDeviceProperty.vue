<template>
	<div class="SpDeviceProperty">
		<div class="SpDeviceProperty__header">
			<div class="SpDeviceProperty__name">
				<h2>{{deviceName}}</h2>
				<span>{{friendlyName}}</span>
			</div>

			<div class="SpDeviceProperty__buttons">
				<sp-button primary :disabled="!hasThingsToUpdate" @click="apply">
					Apply
				</sp-button>

				<sp-button @click="hide">
					Cancel
				</sp-button>
			</diV>
		</div>

		<div class="SpDeviceProperty__property">
			<h3>Role</h3>
			<sp-role-selector v-model="roles" :default="device.roles"></sp-role-selector>
		</div>

		<div class="SpDeviceProperty__property" v-if="isCaptureDevice">
			<h3>Loopback Device</h3>
			<sp-device v-if="loopbackDevice" :device="loopbackDevice" @select="loopback = null" removable></sp-device>
			<sp-placeholder v-else type="render" @device="loopback = $event"></sp-placeholder>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpDeviceProperty {
		&__header {
			display: flex;
			align-items: center;
			margin-top: 10px;
		}

		&__name {
			display: flex;
			flex-direction: column;

			flex: 1;
			min-width: 0;

			h2, span {
				font-family: 'Noto Sans KR', sans-serif;
				margin: 0;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			h2 {
				margin-bottom: 5px;
			}
		}

		&__buttons {
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-left: 5px;
		}

		&__property {
			font-family: 'Fira Sans', sans-serif;
			margin-top: 10px;

			h3 {
				margin: 0;
				margin-bottom: 10px;
			}

			& > *:not(h3) {
				margin-left: 10px;
			}
		}
	}
</style>

<script>
	import SpButton from "../components/SpButton.vue";
	import SpDevice from "../components/SpDevice.vue";
	import SpPlaceholder from "../components/SpPlaceholder.vue";
	import SpRoleSelector from "../components/SpRoleSelector.vue";

	export default {
		data() {
			return {
				updatingRole: undefined,
				updatingLoopback: undefined
			};
		},

		props: {
			device: {
				required: true
			}
		},

		computed: {
			devices() {
				return this.$store.state.devices;
			},

			deviceName() {
				return this.device.name.split('(').shift().trim();
			},

			friendlyName() {
				return this.device.name.split('(').pop().split(')').shift().trim();
			},

			roles: {
				get() {
					return this.updatingRole !== undefined ? this.updatingRole : this.device.roles;
				},

				async set(role) {
					this.updatingRole = role;
				}
			},

			loopback: {
				get() {
					return this.updatingLoopback !== undefined ? this.updatingLoopback : this.device.loopback;
				},

				set(loopbackId) {
					this.updatingLoopback = loopbackId;
				}
			},

			loopbackDevice() {
				return this.devices.find(device => device.id === this.loopback);
			},

			hasThingsToUpdate() {
				return this.updatingRole !== undefined || this.updatingLoopback !== undefined;
			},

			isCaptureDevice() {
				return this.device.type === $soundpanel.TYPES.capture;
			}
		},

		methods: {
			async apply() {
				if(!this.hasThingsToUpdate) return;

				if(this.updatingRole) {
					for(let key in this.updatingRole) {
						if(this.updatingRole[key] && !this.device.roles[key]) {
							await $soundpanel.packets.sendPacket('deviceManager.setRole', {
								id: this.device.id,
								role: key
							});
						}
					}
				}

				if(this.updatingLoopback) {
					await $soundpanel.packets.sendPacket('deviceManager.setLoopback', {
						id: this.device.id,
						loopbackId: this.updatingLoopback
					});
				}

				this.$emit('refresh');
				this.$emit('hide');
			},

			async hide() {
				this.$emit('hide');
			}
		},

		watch: {
			'device.roles': function() {
				this.updatingRole = undefined;
			}
		},

		components: {
			SpButton,
			SpDevice,
			SpPlaceholder,
			SpRoleSelector
		}
	};
</script>
