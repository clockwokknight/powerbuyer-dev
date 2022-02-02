<template>
	<VendorItem v-for="row in data" :key="row.id" :vendor="row" />
</template>

<script>
	import { computed } from "vue";
	import { useStore } from "vuex";
	import VendorItem from "./VendorItem.vue";
	export default {
		components: { VendorItem },
		data() {
			return {
				data: [],
			};
		},
		setup() {
			const store = useStore();
			store.dispatch("getVendors");
			return {
				data: computed(() => store.getters.vendorsFiltered),
			};
		},
	};
</script>
