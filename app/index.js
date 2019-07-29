import "typeface-notosans-kor";
import "@mdi/font/css/materialdesignicons.css";

import getMockData from "./src/Mock";

import App from "./App.vue";
import Vue from "vue";
import Vuex from "vuex";
import Packets from "./src/Packets";
import WindowHandle from "./src/WindowHandle";

Vue.use(Vuex);

const SoundPanel = {
	version: SOUNDPANEL_VERSION,
	builddate: SOUNDPANEL_BUILDDATE,
	environment: SOUNDPANEL_ENVIRONMENT,

	async init() {
		this.store = new Vuex.Store({
			state: {
				devices: []
			},

			mutations: {
				setDevices(state, devices) {
					state.devices = devices;
				}
			}
		});

		if(this.environment === 'electron-renderer') {
			this.electron = require('electron');
			this.handle = new WindowHandle(this.electron);
			this.packets = new Packets(this.electron);
		} else{
			this.packets = getMockData;
		}

		await this.retrieveDevices();

		this.vm = new Vue({
			store: this.store,
			el: "#app",
			render(h) {
				return h(App);
			}
		});
	},

	async retrieveDevices() {
		const {devices: response} = (await this.packets.sendPacket('deviceManager.getDevices'));
		const {types, roles, devices} = response;

		this.TYPES = types;
		this.ROLES = roles;

		this.store.commit(
			'setDevices',
			devices
		);
	}
};

window.$soundpanel = SoundPanel;
SoundPanel.init();
