<template>
	<VendorItem v-for="row in FILTERED_VENDORS" :key="row.id" :vendor="row" />
</template>

<script>
	import { mapGetters, useStore } from "vuex";
	import VendorItem from "./VendorItem.vue";

	export default {
		components: { VendorItem },
		computed: {
			...mapGetters(["FILTERED_VENDORS"]),
		},
		setup() {
			const store = useStore();
			store.dispatch("GET_VENDORS");
		},
	};
</script>
