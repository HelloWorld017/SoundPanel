<template>
	<div class="SpRoleSelector">
		<div class="SpRoleSelector__row">
			<span class="SpRoleSelector__role">
				Default
			</span>

			<sp-checkbox v-model="console" :disabled="asIs || defaultConsole"></sp-checkbox>
		</div>

		<div class="SpRoleSelector__row">
			<span class="SpRoleSelector__role">
				Multimedia
			</span>

			<sp-checkbox v-model="multimedia" :disabled="asIs || defaultMultimedia"></sp-checkbox>
		</div>

		<div class="SpRoleSelector__row">
			<span class="SpRoleSelector__role">
				Communication
			</span>

			<sp-checkbox v-model="communication" :disabled="asIs || defaultCommunication"></sp-checkbox>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.SpRoleSelector {
		&__row {
			display: flex;
			justify-content: space-between;
			max-width: 200px;
			margin-bottom: 5px;
		}

		&__role {
			font-family: 'Fira Sans', sans-serif;
			font-weight: 300;
			font-size: 1.1rem;
		}
	}
</style>

<script>
	import SpCheckbox from "./SpCheckbox.vue";

	export default {
		model: {
			prop: 'roles',
			event: 'update'
		},

		props: {
			default: {
				type: Object,
				required: true
			},

			roles: {
				type: Object,
				required: true
			},

			asIs: Boolean
		},

		computed: {
			console: {
				get() {
					return this.getRole('console');
				},

				set(checked) {
					this.updateRole('console', checked);
				}
			},

			multimedia: {
				get() {
					return this.getRole('multimedia');
				},

				set(checked) {
					this.updateRole('multimedia', checked);
				}
			},

			communication: {
				get() {
					return this.getRole('communication');
				},

				set(checked) {
					this.updateRole('communication', checked);
				}
			},

			defaultConsole() {
				return this.getDefaultRole('console');
			},

			defaultMultimedia() {
				return this.getDefaultRole('multimedia');
			},

			defaultCommunication() {
				return this.getDefaultRole('communication');
			}
		},

		methods: {
			getDefaultRole(roleName) {
				return !!this.default[$soundpanel.ROLES[roleName]];
			},

			getRole(roleName) {
				return !!this.roles[$soundpanel.ROLES[roleName]];
			},

			updateRole(roleName, value) {
				const newRole = {};
				newRole[$soundpanel.ROLES[roleName]] = value;

				this.$emit('update', Object.assign({}, this.roles, newRole));
			}
		},

		components: {
			SpCheckbox
		}
	};
</script>
