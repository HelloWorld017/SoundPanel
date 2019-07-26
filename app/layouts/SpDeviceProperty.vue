<template>
	<div class="SpDeviceProperty">
		<div class="SpDeviceProperty__header">
			<div class="SpDeviceProperty__name">
				<h2>{{deviceName}}</h2>
				<span>{{friendlyName}}</span>
			</div>

			<div class="SpDeviceProperty__buttons">
				<button class="SpDeviceProperty__button SpDeviceProperty__button--primary"
					:class="{'SpDeviceProperty__button--disabled': !hasThingsToUpdate}"
					@click="apply">

					Apply
				</button>

				<button class="SpDeviceProperty__button" @click="hide">
					Cancel
				</button>
			</diV>
		</div>

		<div class="SpDeviceProperty__property">
			<h3>Role</h3>
			<sp-role-selector v-model="roles" :default="device.roles"></sp-role-selector>
		</div>

		<div class="SpDeviceProperty__property" v-if="isCaptureDevice">
			<h3>Loopback Device</h3>
			<div class="SpDeviceProperty__loopback" v-if="loopbackDevice">
				<sp-device :device="loopbackDevice" @select="loopback = null"></sp-device>
			</div>
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

		&__button {
			cursor: pointer;
			background: #404040;
			padding: 10px 20px;
			margin: 2px;
			border: none;
			outline: none;
			color: #fff;
			font-family: 'Fira Sans', sans-serif;

			&--primary {
				background: #00bcd4;
			}

			&--disabled {
				cursor: not-allowed;
				background: #d0d0d0;
			}
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

		&__loopback {
			position: relative;

			&::after {
				content: '\00d7';

				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				display: flex;
				align-items: center;
				justify-content: center;

				color: #fff;
				font-size: 1.3rem;

				background: rgba(0, 0, 0, .8);
				pointer-events: none;

				opacity: 0;
				transition: opacity .4s ease;
			}

			&:hover::after {
				opacity: 1;
			}
		}
	}
</style>

<script>
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
					return this.updatingRole || this.device.roles;
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
				return !!(this.updatingRole || this.updatingLoopback);
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
			},

			async hide() {
				this.$emit('hide');
			}
		},

		watch: {
			'device.roles': function() {
				this.updatingRole = null;
			}
		},

		components: {
			SpDevice,
			SpPlaceholder,
			SpRoleSelector
		}
	};
</script>
