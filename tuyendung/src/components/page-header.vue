<script>
/**
 * A page title component - Renders the title with breadcrumbs
 */
export default {
	components: {},
	props: {
		title: {
			type: String,
			default: '',
		},
		items: {
			type: Array,
			default: () => {
				return []
			},
		},
		icon: {
			type: String,
			default: 'snowflake',
		}
	},
}
</script>

<template>
	<!-- start page title -->
	<div class="row page-title">
		<div class="col-md-12">
			<b-breadcrumb :items="items" class="float-right mt-1"></b-breadcrumb>
			<h4 class="mb-1 mt-0">
				<span class="page-title-icon"><i :class="['uil', 'uil-' + icon]"></i></span> {{ title }}
			</h4>
		</div>
	</div>
	<!-- end page title -->
</template>

<style lang="stylus" scoped>
	.page-title-icon{
		padding: 15px;
		background-color: #FFF;
		justify-items: middle;
		box-shadow: 5px 5px 5px 0px #CCC;
		margin-right: 10px;
	}
	.page-title{
		margin-bottom: 10px;
	}
	.page-title h4{
		text-transform: uppercase;
		font-weight: 700;
	}
</style>