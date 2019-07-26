<template>
	<label class="SpCheckbox" :class="{'SpCheckbox--disabled': disabled}">
		<input type="checkbox" v-model="_value" :disabled="disabled">
		<div class="SpCheckbox__decorator"></div>
	</label>
</template>

<style lang="less" scoped>
	.SpCheckbox {
		cursor: pointer;

		&__decorator {
			display: block;
			width: 10px;
			height: 10px;
			border: 2px solid #202020;
			border-radius: 50%;

			transition: all .4s ease;
		}

		& > input[type="checkbox"] {
			position: absolute;
			opacity: 0;
			z-index: -1;
		}

		& > input[type="checkbox"]:checked + &__decorator {
			border-color: #00bcd4;
			background: #00bcd4;
		}

		&--disabled {
			cursor: not-allowed;

			&__decorator {
				border-color: #808080;
			}
		}

		&&--disabled > input[type="checkbox"]:checked + &__decorator {
			border-color: #808080;
			background: #808080;
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
			value: Boolean,
			disabled: Boolean
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
