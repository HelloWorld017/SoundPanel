<template>
	<div class="SpToggle">
		<a class="SpToggle__item"
			:class="{'SpToggle__item--selected': selected === onValue}"
			@click="selected = onValue">

			<slot name="on"></slot>
		</a>

		<a class="SpToggle__item"
			:class="{'SpToggle__item--selected': selected === offValue}"
			@click="selected = offValue">

			<slot name="off"></slot>
		</a>
	</div>
</template>

<style lang="less" scoped>
	.SpToggle {
		display: flex;
		font-family: 'Fira Sans', sans-serif;

		&__item {
			cursor: pointer;

			display: inline-block;
			width: 100px;
			padding: 10px 20px;

			background: #e4e5e6;
			color: #202020;
			text-align: center;
			transition: all .4s ease;

			&--selected {
				background: #404040;
				color: #f1f2f3;
			}
		}
	}
</style>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'change'
		},

		props: {
			value: {
				default: true
			},

			onValue: {
				default: true
			},

			offValue: {
				default: false
			}
		},

		computed: {
			selected: {
				get() {
					return this.value;
				},

				set(value) {
					this.$emit('change', value);
				}
			}
		}
	}
</script>
