<template>
	<div class="pageTabs">
		<div>
			<!-- Page tabs -->
			<PageTab
				v-if="GET_TABS_LIST"
				v-for="tab in GET_TABS_LIST"
				:info="tab"
				:key="tab.id"
			/>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import PageTab from "./PageTab.vue";
	export default {
		computed: {
			...mapGetters(["GET_TABS_LIST"]),
		},
		components: {
			PageTab,
		},
	};
</script>
