<template>
	<section class="SpPresetTab">
		<div class="SpPresetTab__aside">
			<h1>Presets</h1>
			<div class="SpPresetTab__list">
				<a v-for="(preset, i) in presets"
					class="PresetItem"
					:class="{'PresetItem--selected': selected === i}"
					:key="preset.id"
					@click="selected = i">

					<span class="PresetItem__name">{{preset.name}}</span>
					<span class="PresetItem__tasks">{{preset.tasks.length}}</span>
				</a>

				<a class="PresetItem PresetItem--add" @click="addPreset">
					<i class="mdi mdi-plus"></i> New Preset
				</a>
			</div>
		</div>

		<div class="SpPresetTab__content">
			<sp-preset class="SpPresetTab__preset"
				v-if="presets[selected]"
				:preset="presets[selected]"
				@refresh="refresh">
			</sp-preset>

			<div class="SpPresetTab__preset SpPresetTab__preset--empty" v-else>
				Please Select a Preset!
			</div>
		</div>
	</section>
</template>

<style lang="less" scoped>
	.SpPresetTab {
		user-select: none;
		display: flex;
		background: #fff;
		flex: 1;

		h1 {
			font-family: 'Fira Sans', sans-serif;
			font-weight: 600;
			margin: 20px 0;
		}

		&__aside {
			padding: 20px;
			width: 22vw;
			max-width: 300px;
		}

		&__content {
			background: #f8f9fa;
			flex: 1;
		}

		&__preset {
			height: 100%;

			&--empty {
				display: flex;
				align-items: center;
				text-align: center;

				color: #d0d0d0;
				font-family: 'Noto Sans KR', sans-serif;
				font-size: 3rem;
				font-weight: 500;
				text-transform: uppercase;

				box-sizing: border-box;
				padding: 40px;
			}
		}

		&__list {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	.PresetItem {
		cursor: pointer;

		display: flex;
		justify-content: space-between;
		align-items: center;

		box-sizing: border-box;
		width: 80%;
		padding: 10px 20px;
		margin-top: 10px;

		font-family: 'Noto Sans KR', sans-serif;
		font-size: 1.1rem;
		background: #f1f2f3;

		transition: all .4s ease;

		&__name {
			margin-right: 10px;
			font-weight: 500;
			flex: 1;

			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		&__tasks {
			font-family: 'Fira Sans', sans-serif;
			font-weight: 300;
			font-size: 1.2rem;
		}

		&--add {
			display: block;
			text-align: center;
			font-size: 1rem;
		}

		&--selected {
			background: #202020;
			color: #f1f2f3;
		}
	}
</style>

<script>
	import SpPreset from "./SpPreset.vue";

	export default {
		data() {
			return {
				presets: [],
				selected: null
			};
		},

		async mounted() {
			await this.refresh();
		},

		methods: {
			async refresh() {
				const {presets} = await $soundpanel.packets.sendPacket('presetManager.getPresets');
				this.presets = presets;
			},

			async addPreset() {
				await $soundpanel.packets.sendPacket('presetManager.newPreset')
			}
		},

		components: {
			SpPreset
		}
	};
</script>
