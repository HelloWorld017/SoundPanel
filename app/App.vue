<template>
	<div id="App">
		<div class="Titlebar">
			<soundpanel-text class="Titlebar__brand"></soundpanel-text>

			<div class="Titlebar__buttons">
				<window-button class="Titlebar__button" @click="handle.minimize()"></window-button>
				<window-button class="Titlebar__button" @click="handle.maximize()"></window-button>
				<window-button class="Titlebar__button Titlebar__button--exit" @click="handle.exit()"></window-button>
			</div>
		</div>

		<main class="Main">
			<sp-preset-tab></sp-preset-tab>
			<sp-device-list></sp-device-list>
		</main>
	</div>
</template>

<style lang="less" scoped>
	#App {
		display: flex;
		flex-direction: column;

		width: 100vw;
		height: 100vh;
	}

	.Main {
		display: flex;
		flex: 1;
		transform: translate(0);
	}

	.Titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;

		background: #f1f2f3;

		padding: 0 20px;
		height: 32px;

		-webkit-app-region: drag;
		user-select: none;

		&__brand {
			width: 100px;
			height: 32px;

			& > * {
				fill: #202020 !important;
			}
		}

		&__buttons {
			-webkit-app-region: no-drag;
			* {
				width: 18px;
				height: 18px;
				margin: 0 5px;
			}
		}

		&__button {
			circle {
				transition: all .4s ease;
				fill: #202020;
				cursor: pointer;

				&:hover {
					fill: transparent;
					stroke: #202020;
				}
			}

			&--exit circle{
				fill: #e26b6b;

				&:hover {
					stroke: #e26b6b;
				}
			}
		}
	}
</style>

<style lang="less">
	body, html {
		margin: 0;
		padding: 0;
	}

	.ListFade {
		&-enter-active, &-leave-active, &-move {
			transition: all .4s ease;
		}

		&-enter {
			transform: translate(-20px, 0);
			opacity: 0;
		}

		&-leave{
			&-active {
				 position: absolute;
				 width: 100%;
			}

			&-to {
				transform: translate(20px, 0);
				opacity: 0;
			}
		}
	}

	.Fade {
		&-enter-active, &-leave-active {
			transition: all .4s ease;
		}

		&-enter, &-leave-to {
			opacity: 0;
		}
	}
</style>

<script>
	import SoundpanelText from "./images/SoundpanelText.svg?component";
	import SpDeviceList from "./layouts/SpDeviceList.vue";
	import SpPresetTab from "./layouts/SpPresetTab.vue";
	import WindowButton from "./images/WindowButton.svg?component";

	export default {
		components: {
			SoundpanelText,
			SpDeviceList,
			SpPresetTab,
			WindowButton
		},

		computed: {
			handle() {
				if($soundpanel.handle)
					return $soundpanel.handle;

				return {
					minimize: _=>{}, maximize: _=>{}, exit: _=>{}
				};
			}
		}
	};
</script>
