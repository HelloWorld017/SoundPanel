<template>
	<div class="SpChooser">
		<select class="SpChooser__input" v-model="_value">
			<slot></slot>
		</select>

		<div class="SpChooser__decorator">
			<i class="mdi mdi-chevron-down"></i>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpChooser {
		background: #383838;
		box-sizing: border-box;
		display: inline-block;
		padding: 10px;
		position: relative;

		&__input {
			appearance: none;
			background: #383838;
			border: 1px solid #606060;
			box-sizing: border-box;
			font-family: 'Fira Sans', sans-serif;
			font-weight: 300;
			font-size: 1rem;
			padding: 5px 20px;
			padding-right: 40px;
			color: #f1f2f3;
			outline: none;
		}

		&__decorator {
			position: absolute;
			color: #fff;
			right: 20px;
			top: 50%;
			transform: translate(0, -50%);
			pointer-events: none;
		}
	}
</style>

<style lang="less">
	.SpChooser {
		&__input {
			* {
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
				type: String,
				required: true
			}
		},

		computed: {
			_value: {
				get() {
					return this.value;
				},

				set(value) {
					this.$emit('change', value);
				}
			}
		}
	};
</script>
