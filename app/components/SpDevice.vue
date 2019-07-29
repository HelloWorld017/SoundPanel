<template>
	<div class="SpDevice" :class="{
			'SpDevice--selected': selected,
			'SpDevice--removable': removable,
			'SpDevice--minimal': minimal,
			'SpDevice--select-disabled': disableSelect
		}" :draggable="draggable"
		@click="selectDevice()" @dragstart="dragStart">

		<div class="SpDevice__content">
			<div class="SpDevice__icon">
				<i class="mdi" :class="`mdi-${deviceIcon}`"></i>
			</div>

			<div class="SpDevice__texts" :title="device.name">
				<h2>{{deviceName}}</h2>
				<span>{{friendlyName}}</span>
			</div>

			<div class="SpDevice__roles" v-if="!minimal">
				<div class="SpDevice__role">
					<sp-indicator :value="device.roles[roles.console]" :inverse="selected">
						<i class="mdi mdi-check"></i>
					</sp-indicator>

					<sp-indicator :value="device.roles[roles.multimedia]" :inverse="selected">
						<i class="mdi mdi-video-outline"></i>
					</sp-indicator>

					<sp-indicator :value="device.roles[roles.communication]" :inverse="selected">
						<i class="mdi mdi-phone"></i>
					</sp-indicator>
				</div>
			</div>
		</div>

		<div class="SpDevice__loopback" v-if="loopback && !minimal">
			<loopback-icon class="LoopbackIcon"></loopback-icon> {{loopback.name}}
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpDevice {
		cursor: pointer;
		user-select: none;
		background: #e4e5e6;
		max-width: 350px;

		transition: all .4s ease;

		&--removable {
			position: relative;

			&::after {
				content: '\00d7';

				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				display: flex;
				align-items: center;
				justify-content: center;

				color: #fff;
				font-size: 1.3rem;

				background: rgba(0, 0, 0, .8);
				pointer-events: none;

				opacity: 0;
				transition: opacity .4s ease;
			}

			&:hover::after {
				opacity: 1;
			}
		}

		&--minimal {
			padding-right: 10px;
		}

		&--minimal & {
			&__content {
				height: 72px;
			}

			&__texts {
				h2 {
					font-size: 1.2rem;
				}

				span {
					font-size: .8rem;
				}

				padding-left: 10px;
			}

			&__icon {
				width: 48px;
				height: 48px;
				line-height: 48px;
				font-size: 1.5rem;
			}
		}

		&--select-disabled {
			cursor: default;
		}

		&--selected {
			background: #00bcd4;
		}

		&--selected & {
			&__texts {
				color: #fff;
			}

			&__loopback {
				color: #fff;

				.LoopbackIcon * {
					stroke: #fff !important;
				}
			}
		}

		&__content {
			display: flex;
			align-items: center;
		}

		&__icon {
			width: 72px;
			height: 72px;

			text-align: center;
			line-height: 72px;

			color: #fff;
			background: #00bcd4;
			font-size: 2.5rem;
		}

		&__texts {
			font-family: 'Noto Sans KR', sans-serif;
			flex: 1;
			padding-left: 20px;

			display: flex;
			flex-direction: column;
			min-width: 0;

			transition: color .4s ease;

			h2, span {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			h2 {
				margin: 0;
				font-size: 1.45rem;
				font-weight: 300;
			}

			span {
				font-size: .85rem;
				font-weight: 500;
			}
		}

		&__loopback {
			margin-left: 92px;
			padding-top: 4px;
			padding-bottom: 8px;

			font-family: 'Noto Sans KR', sans-serif;
			transition: color .4s ease;

			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			.LoopbackIcon * {
				transition: stroke .4s ease;
			}
		}

		&__roles {
			padding-right: 10px;
		}
	}
</style>

<script>
	import LoopbackIcon from "../images/LoopbackIcon.svg?component";
	import SpIndicator from "./SpIndicator.vue";

	export default {
		data() {
			return {
				roles: $soundpanel.ROLES
			};
		},

		props: {
			device: {
				required: true
			},

			draggable: Boolean,
			selected: Boolean,
			disableSelect: Boolean,
			removable: Boolean,
			minimal: Boolean
		},

		computed: {
			devices() {
				return this.$store.state.devices;
			},

			deviceName() {
				if(this.device.unknown) return 'Unknown Device';

				return this.device.name.split('(').shift().trim();
			},

			friendlyName() {
				if(this.device.unknown) return 'Your device may be detached';

				return this.device.name.split('(').pop().split(')').shift().trim();
			},

			deviceIcon() {
				if(this.device.type === $soundpanel.TYPES.capture)
					return 'microphone-outline';

				if(this.device.type === $soundpanel.TYPES.render)
					return 'speaker';

				return 'alert-outline';
			},

			loopback() {
				if(!this.device.loopback) return null;

				return this.devices.find(({id}) => id === this.device.loopback);
			}
		},

		methods: {
			selectDevice() {
				this.$emit('select', this.device.id);
			},

			dragStart(event) {
				const type =
					(this.device.type === $soundpanel.TYPES.capture) ? 'capture' :
					((this.device.type === $soundpanel.TYPES.render) ? 'render' : 'unknown');

				if(type === 'unknown') return false;

				event.dataTransfer.setData('text/x-soundpanel-device', `Device/${this.device.id};DeviceType/${type};`);
			}
		},

		components: {
			LoopbackIcon,
			SpIndicator
		}
	};
</script>
