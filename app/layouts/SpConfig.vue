<template>
	<transition name="Fade">
		<div class="SpConfig" v-if="opened" @click.self="close">
			<div class="SpConfig__dialog">
				<a class="SpConfig__close" @click="close">
					<i class="mdi mdi-close"></i>
				</a>

				<h1>Settings</h1>
				<div class="ConfigItem" v-for="(configObject, key) in configDescriptor">
					<template v-if="configObject.type === 'boolean'">
						<sp-checkbox
							:value="configs[key]"
							@change="updateSettings(key, $event)">
						</sp-checkbox>

						{{configObject.name}}
					</template>
					<template v-else-if="configObject.type === 'string'">
						{{configObject.name}}

						<sp-text-input type="text"
							v-model="dummies[key]"
							@blur="updateSettings(key, dummies[key])">
						</sp-text-input>
					</template>
				</div>
			</div>
		</div>
	</transition>
</template>

<style lang="less" scoped>
	.SpConfig {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;

		display: flex;
		justify-content: center;
		align-items: center;

		background: rgba(0, 0, 0, .8);
		z-index: 9;

		&__dialog {
			position: relative;
			width: 60vw;
			height: 80vh;
			box-sizing: border-box;
			padding: 20px 40px;

			background: #f1f2f3;
			font-family: 'Fira Sans', sans-serif;

			display: flex;
			flex-direction: column;
		}

		&__close {
			cursor: pointer;
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}

	.ConfigItem {
		display: flex;
		align-items: center;

		& > * {
			margin: 5px;
		}
	}
</style>

<script>
	import configDescriptor from "../src/Config";

	import SpCheckbox from "../components/SpCheckbox.vue";
	import SpTextInput from "../components/SpTextInput.vue";

	export default {
		data() {
			return {
				configDescriptor,
				dummies: {},
				configs: {}
			};
		},

		model: {
			prop: 'opened',
			event: 'change'
		},

		props: {
			opened: Boolean
		},

		methods: {
			close() {
				this.$emit('change', false);
			},

			async retrieveSettings() {
				const {configs} = await $soundpanel.packets.sendPacket('app.config');
				this.configs = configs;

				const dummyConfigs = {};
				Object.keys(configDescriptor).forEach(key => {
					if(configDescriptor[key].type === 'string') {
						dummyConfigs[key] = this.configs[key];
					}
				});
				this.dummies = Object.assign({}, this.dummies, dummyConfigs);
			},

			async updateSettings(key, value) {
				await $soundpanel.packets.sendPacket('app.config', {
					update: true,
					key,
					value
				});

				this.configs[key] = value;
				this.dummies[key] = value;
			}
		},

		mounted() {
			this.retrieveSettings();
		},

		components: {
			SpCheckbox,
			SpTextInput
		}
	};
</script>
