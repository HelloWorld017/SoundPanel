<template>
	<section class="SpDeviceList">
		<h1>Devices</h1>
		<div class="SpDeviceList__header">
			<sp-toggle class="SpDeviceList__tab" v-model="selected" onValue="capture" offValue="render">
				<span slot="on">Microphones</span>
				<span slot="off">Speakers</span>
			</sp-toggle>

			<a class="SpDeviceList__refresh" @click="refresh">
				<i class="mdi mdi-refresh"></i>
			</a>
		</div>

		<div class="SpDeviceList__list" @click="unselectDevice" ref="list">
			<transition-group class="SpDeviceList__devices" name="ListFade" tag="div">
				<sp-device v-for="device in devices"
					:device="device" :key="device.id"
					:selected="selectedDeviceId === device.id"
					@select="selectDevice" draggable>
				</sp-device>
			</transition-group>
		</div>

		<sp-device-property class="SpDeviceList__property"
			v-if="selectedDevice" :device="selectedDevice" @hide="selectedDeviceId = null" @refresh="retrieve">
		</sp-device-property>
	</section>
</template>

<style lang="less" scoped>
	.SpDeviceList {
		display: flex;
		flex-direction: column;

		background: #f1f2f3;
		height: 100%;
		box-sizing: border-box;

		padding: 20px;
		user-select: none;
		width: 350px;

		h1 {
			font-family: 'Fira Sans', sans-serif;
			font-weight: 600;
			margin: 0;
			margin-top: 20px;
		}

		&__tab {
			margin: 10px 0;
		}

		&__list {
			flex: 1;
			overflow: auto;
		}

		&__devices {
			position: relative;
			width: 100%;
			overflow: hidden;

			& > * {
				box-sizing: border-box;
				margin-top: 20px;
			}
		}

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__refresh {
			cursor: pointer;
			font-size: 1.4rem;
			color: #404040;
		}
	}
</style>

<script>
	import SpDevice from "../components/SpDevice.vue";
	import SpDeviceProperty from "./SpDeviceProperty.vue";
	import SpToggle from "../components/SpToggle.vue";

	export default {
		data() {
			return {
				selected: 'capture',
				selectedDeviceId: null
			};
		},

		computed: {
			devices() {
				return this.devicesAll.filter(device => device.type === $soundpanel.TYPES[this.selected]);
			},

			devicesAll() {
				return this.$store.state.devices;
			},

			selectedDevice() {
				return this.devicesAll.find(device => device.id === this.selectedDeviceId);
			}
		},

		methods: {
			async retrieve() {
				await $soundpanel.retrieveDevices();
			},

			async refresh() {
				await $soundpanel.packets.sendPacket('deviceManager.refresh');
				await this.retrieve();
			},

			selectDevice(id) {
				this.selectedDeviceId = id;
			},

			unselectDevice($event) {
				if($event.target !== this.$refs.list) return;

				this.selectedDeviceId = null;
			}
		},

		components: {
			SpDevice,
			SpDeviceProperty,
			SpToggle
		}
	};
</script>
