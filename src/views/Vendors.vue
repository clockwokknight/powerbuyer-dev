<template>
	<div class="flex w-full vendors">
		<!-- Don't show PageItemsList on dashboard  | Current Page List -->
		<div
			class="relative pageItemsList min-w-[275px] max-w-[275px] h-screen overflow-auto overflow-x-hidden bg-white"
		>
			<!-- List search & filters -->
			<div class="sticky top-0 p-3 bg-white">
				<div>{{ route.name }}</div>
				<div class="flex">
					<div class="mr-3">
						<n-input
							v-model:value="searchText"
							@input="search"
							round
							clearable
							placeholder="Search..."
						/>
					</div>
					<div>
						<n-button type="primary">Filter</n-button>
					</div>
				</div>
				<!-- Filter Component -->
			</div>
			<!-- Main Loop List -->
			<div class="">
				<ul>
					<!-- Loop List-->
					<li
						v-if="GET_FILTERED_VENDORS"
						v-for="vendor in GET_FILTERED_VENDORS"
						:key="vendor.id"
						:vendor="vendor"
						class="p-2 border-b-2"
						@click="showVendor(vendor)"
					>
						<!-- Company Name -->
						{{ vendor.company }}
						<!-- City, State -->
						{{ vendor.city }}, {{ vendor.state }}
						<!-- Phone - Link Email -->
						{{ vendor.phone }} -
						<a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>
					</li>
				</ul>
			</div>
		</div>
		<!-- Main Tabs App Content -->
		<div class="w-full h-screen">
			<div class="flex justify-between w-full h-14">
				<div class="pageTabs">
					<div>
						<!-- Page tabs -->
						<PageTabs :activeTab="activeTab" :key="activeTab" />
					</div>
				</div>
			</div>
			<!-- Main Body Content-->
			<div class="h-screen overflow-auto overflow-x-hidden bg-white">
				<!-- Body Content -->
			</div>
		</div>
	</div>
</template>

<script>
	import { useRoute } from "vue-router";
	import PageTabs from "@/components/PageTabs.vue";
	import { ref } from "vue";
	import { mapActions, mapState } from "pinia";
	import { useVendors } from "@/store/vendors";
	export default {
		setup() {
			const route = useRoute();
			const store = useVendors();

			// Couldn't access refs from PageTabs, so I made a ref and this is
			// getting passed down as a prop into <PageTabs /> so it could
			// dynamically updated the selected tab (selected tab comes from
			// the state )
			const activeTab = ref(0);

			// pull in vendors
			store.GET_ALL_VENDORS();

			return {
				route,
				searchText: ref(""),
				activeTab,
				showVendor(vendorInfo) {
					store.CREATE_NEW_TAB(vendorInfo);
					store.SET_ACTIVE_TAB(vendorInfo);
					activeTab.value = vendorInfo.id;
				},
			};
		},
		components: {
			PageTabs,
		},
		computed: {
			...mapState(useVendors, ["GET_VENDORS", "GET_FILTERED_VENDORS"]),
		},
		methods: {
			...mapActions(useVendors, [
				"FILTER_LIST",
				"SET_SEARCH_TERM",
				"CREATE_NEW_TAB",
				"SET_ACTIVE_TAB",
			]),
			search() {
				this.SET_SEARCH_TERM(this.searchText);
				this.FILTER_LIST(this.searchText);
			},
		},
	};
</script>
