<template>
	<input type="text" class="SpTextInput" @blur="$emit('blur', $event)" v-model="_value">
</template>

<style lang="less" scoped>
	.SpTextInput {
		font-family: 'Noto Sans KR', sans-serif;
		font-size: 1.2rem;
		padding: 5px 10px;
		background: transparent;
		border: none;
		border-bottom: 2px solid #202020;
		outline: none;

		&::selection {
			background: #202020;
			color: #f1f2f3;
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
			value: String
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
