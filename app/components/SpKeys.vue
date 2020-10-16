<template>
	<div class="SpKeys">
		<kbd class="SpKeys__key" v-for="key in keys" @click="removeKey(key)">
			{{key}}
		</kbd>

		<a class="SpKeys__key SpKeys__key--add" @click="openDialog">
			<i class="mdi mdi-plus"></i>
		</a>

		<transition name="Fade">
			<div class="SpKeys__dialog KeyDialog" @click="keyInput = false" v-if="keyInput">
				<div class="KeyDialog__help">
					Click / ESC to cancel.<br>
					<template v-if="!currentInput">
						Input keys with modifier to add.<br>
						Assigning same keys with other presets will cycle over presets.
					</template>
					<template v-else>
						Hold current input for 2s!
					</template>
				</div>

				<input type="text" ref="dialogKey"
					@keydown.prevent="handleKeys($event)"
					@keyup.prevent="handleKeyOff()">

				<div class="KeyDialog__input">
					{{currentInput}}
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="less" scoped>
	.SpKeys {
		&__key {
			cursor: pointer;
			font-family: 'Iosevka', monospace;
			background: #e4e5e6;
			color: #202020;
			padding: 5px 11px;
			border-radius: 12px;

			&:not(:last-child) {
				margin-right: 5px;
			}

			&:not(&--add) {
				&::after {
					display: inline-block;
					content: "\00d7";
					opacity: 0;
					width: 0;
					text-align: center;
					transition: all .4s ease;
				}

				&:hover::after {
					opacity: 1;
					width: 1rem;
				}
			}

			&--add {
				padding: 5px 7px;
			}
		}
	}

	.KeyDialog {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		top: 0;
		left: 0;

		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .8);

		font-family: 'Fira Sans', sans-serif;
		font-size: 3rem;
		font-weight: 100;
		color: #fff;

		z-index: 10;

		input {
			width: 1px;
			height: 1px;
			opacity: 0;
		}

		&__help {
			text-align: center;
			font-size: 1.4rem;
			font-weight: 400;
		}
	}
</style>

<script>
	import Packets from '../src/Packets';

	import getKeyCode from "../src/Keycode";

	export default {
		data() {
			return {
				keyInput: false,
				currentInput: '',
				currentInputId: ''
			};
		},

		props: {
			keys: {
				type: Array,
				required: true
			}
		},

		methods: {
			addKey(key) {
				this.$emit('add', key);
			},

			removeKey(key) {
				this.$emit('remove', key);
			},

			handleKeys(evt) {
				if(evt.repeat) return;
				if(evt.key === 'Escape') return this.keyInput = false;

				this.currentInput = getKeyCode(evt);

				const currentId = Math.random().toString(36).slice(2);
				this.currentInputId = currentId;

				setTimeout(() => {
					if(
						currentId === this.currentInputId &&
						this.currentInput && this.keyInput
					) {
						this.addKey(this.currentInput);
						this.keyInput = false;
					}
				}, 2000);
			},

			handleKeyOff() {
				this.currentInput = '';
				this.currentInputId = null;
			},

			openDialog() {
				this.currentInput = '';

				$soundpanel.packets.sendPacket(
					'shortcutManager.interrupt'
				).then(({ result }) => {
					if (result) {
						this.addKey(result);
						this.keyInput = false;
					}
				});

				this.keyInput = true;

				this.$nextTick(() => {
					this.$refs.dialogKey.focus();
				});
			}
		},

		watch: {
			keyInput (val) {
				if (!val) {
					$soundpanel.packets.sendPacket(
						'shortcutManager.resume'
					);
				}
			}
		}
	};
</script>
