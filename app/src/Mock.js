const mocks = {
	'deviceManager.getDevices': {
		devices: {
			devices: [
				{
					id: '{0.0.0.00000000}.{001e225d-2a30-4d40-8328-d0d6dd329b73}',
					name: '스피커(USBZH5XK)',
					type: 0,
					roles: {
						0: true,
						1: true,
						2: true
					}
				},

				{
					id: '{0.0.1.00000000}.{f4995d8e-bc6f-4766-b3f9-1b3193733f82}',
					name: '마이크(USBZH5XK)',
					type: 1,
					roles: {
						0: true,
						1: true
					}
				},

				{
					id: '{0.0.1.00000000}.{c8db0c2d-0f86-4c3d-8271-94621d2dabc6}',
					name: 'CABLE Output(VB-Audio Virtual Cable)',
					type: 1,
					roles: {
						2: true
					},
					loopback: '{0.0.0.00000000}.{001e225d-2a30-4d40-8328-d0d6dd329b73}'
				}
			],

			types: {
				render: 0,
				capture: 1
			},

			roles: {
				console: 0,
				multimedia: 1,
				communication: 2
			}
		}
	},

	'presetManager.getPresets': {
		presets: [
			{
				type: 'preset',
				id: 'Preset/5fb6495c-fe38-458c-9813-97e4b64100a4',
				name: 'Play to Headset',
				tasks: [
					{
						id: 'Task/a0641f7f-844e-4bdd-8bda-54b8a2862cc9',
						source: "{0.0.1.00000000}.{f4995d8e-bc6f-4766-b3f9-1b3193733f82}",
						target: "{0.0.0.00000000}.{001e225d-2a30-4d40-8328-d0d6dd329b73}",
						type: "task.loopback"
					},

					{
						id: 'Task/67907516-1dad-4da6-b4c1-a2c29f1be48d',
						device: "{0.0.0.00000000}.{001e225d-2a30-4d40-8328-d0d6dd329b73}",
						role: {1: true},
						type: "task.endpoint"
					}
				],
				shortcuts: ['Control + Alt + Numpad1']
			}
		]
	},

	'app.config': {
		config: {
			runOnStartup: false
		}
	}
};

export default {
	async sendPacket(name, payload) {
		console.log("MockRequest", name, payload);

		return mocks[name];
	}
};
