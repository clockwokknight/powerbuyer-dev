<template>
	<li class="p-2 border-b-2" @click="showVendor(vendor)">
		<!-- Company Name -->
		{{ vendor.company }}
		<!-- City, State -->
		{{ vendor.city }}, {{ vendor.state }}
		<!-- Phone - Link Email -->
		{{ vendor.phone }} - <a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>
	</li>
</template>

<script>
	import { useVendors } from "@/store/vendors";
	import { mapActions } from "pinia";

	export default {
		props: ["vendor"],
		methods: {
			...mapActions(useVendors, ["CREATE_NEW_TAB"]),
			showVendor(vendorInfo) {
				this.CREATE_NEW_TAB(vendorInfo);
			},
		},
	};
</script>
