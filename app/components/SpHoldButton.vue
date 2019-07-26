<template>
	<a class="SpHoldButton" :class="{'SpHoldButton--holding': isHoldMode}"
		@mousedown="startHold" @mouseup="cancelHold" @mouseleave="cancelHold">

		<div class="SpHoldButton__pie" :class="{
			'SpHoldButton__pie--hidden': !isHoldMode
		}" :style="{
			background: `conic-gradient(${color} ${percentage}%, transparent 0)`
		}"></div>

		<span class="SpHoldButton__content">
			<slot></slot>
		</span>
	</a>
</template>

<style lang="less" scoped>
	.SpHoldButton {
		cursor: grab;
		position: relative;
		display: inline-block;

		&--holding {
			cursor: grabbing;
		}

		&__pie {
			width: 50px;
			height: 50px;
			border-radius: 50%;

			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 1;

			transition: all .4s ease;

			&--hidden {
				opacity: 0;
			}
		}

		&__content {
			position: relative;
		}
	}
</style>

<script>
	export default {
		data() {
			return {
				intervalId: null,
				start: 0,
				current: 0,
				isHoldMode: false
			};
		},

		props: {
			color: {
				type: String,
				default: '#e1e2e3'
			},

			length: {
				type: Number,
				default: 2000
			}
		},

		computed: {
			percentage() {
				const elapsed = this.current - this.start;
				return Math.floor((elapsed / this.length) * 90) + 10;
			}
		},

		methods: {
			startHold() {
				if(this.intervalId) {
					this.cancelHold();
				}

				this.start = Date.now();
				this.current = Date.now();

				this.intervalId = setInterval(() => {
					this.current = Date.now()

					if(this.percentage > 100) {
						this.cancelHold();
						this.$emit('hold');
					}
				}, 100);

				this.isHoldMode = true;
			},

			cancelHold() {
				if(!this.isHoldMode) return;

				if(this.intervalId) {
					clearInterval(this.intervalId);
				}

				this.isHoldMode = false;
			}
		}
	};
</script>
