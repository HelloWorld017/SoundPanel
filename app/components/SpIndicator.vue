<template>
	<div class="SpIndicator" :class="{'SpIndicator--active': value, 'SpIndicator--inverse': inverse}">
		<span class="SpIndicator__text">
			<slot></slot>
		</span>

		<div class="SpIndicator__indication"></div>
	</div>
</template>

<style lang="less" scoped>
	.SpIndicator {
		&__text {
			color: #c4c4c4;
			font-size: 1rem;
			vertical-align: middle;

			transition: color .4s ease;
		}

		&__indication {
			display: inline-block;
			vertical-align: middle;
			white-space: nowrap;

			background: #c4c4c4;
			width: 12px;
			height: 12px;
			border-radius: 6px;

			transition: background .4s ease;
		}

		&--active & {
			&__text {
				color: #00bcd4;
			}

			&__indication {
				background: #00bcd4;
			}
		}

		&--inverse & {
			&__text {
				color: transparent;
			}

			&__indication {
				background: transparent;
			}
		}

		&--inverse&--active & {
			&__text {
				color: #fff;
			}

			&__indication {
				background: #fff;
			}
		}
	}
</style>

<script>
	export default {
		props: {
			value: Boolean,
			inverse: Boolean
		}
	};
</script>
