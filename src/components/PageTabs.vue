<template>
	<div class="pageTabs">
		<div>
			<!-- Page tabs -->
			<div class="p-8">
				<ul class="list-reset flex border-b">
					<li class="-mb-px mr-1" v-if="GET_TABS" v-for="tab in GET_TABS" :key="tab.id">
						<a
							@click="SET_ACTIVE_TAB(tab)"
							:class="`bg-white inline-block ${
								GET_ACTIVE_TAB.id === tab.id
									? 'border-l border-t border-r rounded-t text-blue-800'
									: 'text-blue-400 hover:text-blue-600'
							} py-2 px-4 font-semibold`"
							href="#"
							>{{ tab.name }}</a
						>
						<button @click="CLOSE_TAB(tab.id)" class="text-red-600 font-bold">X</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import { useVendors } from "@/store/vendors";
	import { mapActions, mapState } from "pinia";

	export default {
		computed: {
			...mapState(useVendors, ["GET_TABS", "GET_ACTIVE_TAB"]),
		},
		methods: {
			...mapActions(useVendors, ["CLOSE_TAB", "SET_ACTIVE_TAB"]),
		},
	};
</script>
