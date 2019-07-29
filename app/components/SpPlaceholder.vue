<template>
	<div class="SpPlaceholder" :class="{
			'SpPlaceholder--drop': isDragOver && isValidDrag,
			'SpPlaceholder--invalid': isDragOver && !isValidDrag
		}" @dragenter="dragEnter" @dragover="dragOver"
		@dragleave="dragLeave" @drop="drop">

		<span class="SpPlaceholder__text">
			{{text}}
		</span>
	</div>
</template>

<style lang="less" scoped>
	.SpPlaceholder {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px dashed #c8c8c8;
		box-sizing: border-box;
		max-width: 350px;
		height: 72px;

		color: #808080;
		font-weight: 600;
		font-family: 'Fira Sans';
		font-size: 1.2rem;
		text-align: center;
		transition: all .4s ease;

		* {
			pointer-events: none;
		}

		&&--drop {
			border-color: #00bcd4;
		}

		&&--invalid {
			border-color: #ef5350;
			color: #ef5350;
		}
	}
</style>

<script>
	export default {
		data() {
			return {
				isDragOver: false,
				isValidDrag: false
			};
		},

		props: {
			type: {
				type: String,
				default: 'all'
			}
		},

		computed: {
			text() {
				if(!this.isDragOver) {
					if(this.type === 'all') return 'Drop a Device!';
					return `Drop a ${this.type === 'render' ? 'Speaker' : 'Microphone'} Device!`
				}

				if(this.isValidDrag) return 'Drop here!';
				if(this.type === 'all') return 'This is not a device!';
				return `This is not a ${this.type === 'render' ? 'speaker' : 'microphone'} device!`;
			}
		},

		methods: {
			handleDrag(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			},

			dragEnter(ev) {
				this.isDragOver = true;

				if(ev.dataTransfer) {
					let item = null;
					for(let itemCandidate of ev.dataTransfer.items) {
						if(itemCandidate.type === 'text/x-soundpanel-device') {
							item = itemCandidate;
							break;
						}
					}
					if(!item) return this.isValidDrag = false;

					this.isValidDrag = true;
				}
			},

			dragOver(ev) {
				this.handleDrag(ev);
			},

			dragLeave(ev) {
				this.handleDrag(ev);
				this.resetDrag();
			},

			drop(ev) {
				this.handleDrag(ev);
				if(!this.isValidDrag) return this.resetDrag();

				const data = ev.dataTransfer.getData('text/x-soundpanel-device');
				if(!data) return this.resetDrag();

				const match = data.match(/^Device\/(.*);DeviceType\/(.*);$/);
				if(!match) return this.resetDrag();

				this.deviceId = match[1];
				this.deviceType = match[2];

				if(this.type !== 'all' && this.type !== this.deviceType) {
					this.isValidDrag = false;
					setTimeout(() => this.resetDrag(), 1000);
					return;
				}

				this.$emit('device', this.deviceId);
				this.resetDrag();
			},

			resetDrag() {
				this.isDragOver = false;
				this.isValidDrag = true;
			}
		}
	};
</script>
