<template>
	<div class="pageTabs">
		<div>
			<!-- Page tabs -->
			<n-tabs
				v-model:value="name"
				type="card"
				closable
				@close="CLOSE_TAB"
				tab-style="min-width: 80px;"
			>
				<n-tab-pane
					v-for="panel in GET_TABS"
					:key="panel.id"
					:tab="panel.company"
					:name="panel.id"
				>
					<p>{{ panel.company }}</p>
					<p>{{ panel.city }}, {{ panel.state }}</p>
					<p>
						{{ panel.phone }} - <a :href="`mailto:${panel.email}`">{{ panel.email }}</a>
					</p>
				</n-tab-pane>
			</n-tabs>
		</div>
	</div>
</template>
<script>
	import { useVendors } from "@/store/vendors";
	import { mapActions, mapState } from "pinia";
	import { ref } from "vue";

	export default {
		props: ["activeTab"],
		setup(props) {
			const store = useVendors();

			const tabNameRef = ref(props.activeTab);
			const panelsRef = ref(store.GET_TABS);
			return {
				panels: panelsRef,
				name: tabNameRef,
			};
		},
		computed: {
			...mapState(useVendors, ["GET_TABS", "GET_ACTIVE_TAB"]),
		},
		methods: {
			...mapActions(useVendors, ["CLOSE_TAB"]),
		},
	};
</script>
