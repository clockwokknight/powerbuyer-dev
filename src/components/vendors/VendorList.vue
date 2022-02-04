<template>
	<VendorItem
		v-if="GET_VENDORS"
		v-for="vendor in GET_VENDORS"
		:key="vendor.id"
		:vendor="vendor"
	/>
</template>

<script>
	import { useVendors } from "@/store/vendors";
	import { mapState } from "pinia";
	import VendorItem from "./VendorItem.vue";
	export default {
		setup() {
			const store = useVendors();

			store.GET_FILTERED_VENDORS();
		},
		computed: {
			...mapState(useVendors, ["GET_VENDORS"]),
		},
		components: {
			VendorItem,
		},
	};
</script>
