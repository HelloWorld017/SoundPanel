<template>
	<button class="SpButton" :class="{
			'SpButton--primary': primary,
			'SpButton--disabled': disabled
		}"
		:disabled="disabled"
		@click="$emit('click', $event)">

		<slot></slot>
	</button>
</template>

<style lang="less" scoped>
	.SpButton {
		cursor: pointer;
		background: #404040;
		padding: 10px 20px;
		margin: 2px;
		border: none;
		outline: none;
		color: #fff;
		font-family: 'Fira Sans', sans-serif;
		transition: all .4s ease;

		&--primary {
			background: #00bcd4;
		}

		&--disabled {
			cursor: not-allowed;
			background: #d0d0d0;
		}
	}
</style>

<script>
	export default {
		props: {
			primary: Boolean,
			disabled: Boolean
		}
	};
</script>
