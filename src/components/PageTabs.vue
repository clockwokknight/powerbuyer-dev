<template>
	<div class="pageTabs">
		<div>
			<!-- Page tabs -->
			<n-tabs
				v-model:value="name"
				type="card"
				closable
				@close="handleClose"
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
		setup() {
			const store = useVendors();

			const tabNameRef = ref("");
			const panelsRef = ref(store.GET_TABS);
			function handleClose(tabId) {
				// alert("hi");
				store.CLOSE_TAB(tabId);
				// const { value: panels } = panelsRef;
				// console.log(panelsRef);
				// console.log(panels);
				// const index = panels.findIndex((v) => name === v);
				// panels.splice(index, 1);
				// if (tabNameRef.value === name) {
				// 	tabNameRef.value = panels[index];
				// }
			}
			return {
				panels: panelsRef,
				name: tabNameRef,
				handleClose,
			};
		},
		computed: {
			...mapState(useVendors, ["GET_TABS"]),
		},
		methods: {
			...mapActions(useVendors, ["CLOSE_TAB"]),
		},
	};
</script>
