<template>
	<li
		class="border-b-2"
		@mouseup="
			SET_SELECTED_VENDOR(vendor);
			ADD_TAB(vendor);
		"
	>
		<!-- Company Name -->
		<div class="pl-4 mb-2 mt-2 font-bold">{{ vendor.company }}</div>
		<!-- City, State -->
		<div class="pl-4 mb-2 mt-2 font-bold">{{ vendor.city }}</div>
		<!-- Phone - Link Email -->
		<div class="pl-4 mb-2 mt-2 font-bold">
			{{ vendor.phone }}
			<a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>
		</div>
	</li>
</template>

<script>
	import { mapActions, useStore } from "vuex";
	const store = useStore();

	export default {
		props: ["vendor"],
		methods: {
			...mapActions(["SET_SELECTED_VENDOR", "ADD_TAB"]),
		},
	};
</script>
