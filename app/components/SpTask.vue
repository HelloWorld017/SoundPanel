<template>
	<div class="SpTask" @click="$emit('click', $event)">
		<a class="SpTask__remove" @click="$emit('remove')" v-if="removable">
			<i class="mdi mdi-close"></i>
		</a>
		<slot></slot>
	</div>
</template>

<style lang="less">
	.SpTask {
		padding: 20px 40px;
		background: #f1f2f3;

		display: flex;
		align-items: center;
		justify-content: center;

		position: relative;
		font-family: 'Fira Sans', sans-serif;

		&__remove {
			cursor: pointer;
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}
</style>

<script>
	export default {
		props: {
			removable: Boolean
		}
	};
</script>
