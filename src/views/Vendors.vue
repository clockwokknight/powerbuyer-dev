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
						{{ vendor.name }}
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
						<PageTabs />
					</div>
				</div>
			</div>
			<!-- Main Body Content-->
			<div class="h-screen overflow-auto overflow-x-hidden bg-white">
				<!-- Body Content -->
				<div v-if="GET_ACTIVE_TAB.id">
					<p>{{ GET_ACTIVE_TAB.accounting_code }}</p>
					<p>{{ GET_ACTIVE_TAB.address_one }}</p>
					<p>{{ GET_ACTIVE_TAB.address_two }}</p>
					<p>{{ GET_ACTIVE_TAB.city }}</p>
					<p>{{ GET_ACTIVE_TAB.comments }}</p>
					<p>{{ GET_ACTIVE_TAB.country }}</p>
					<p>{{ GET_ACTIVE_TAB.created_at }}</p>
					<p>{{ GET_ACTIVE_TAB.din }}</p>
					<p>{{ GET_ACTIVE_TAB.email }}</p>
					<p>{{ GET_ACTIVE_TAB.id }}</p>
					<p>{{ GET_ACTIVE_TAB.name }}</p>
					<p>{{ GET_ACTIVE_TAB.other_phones }}</p>
					<p>{{ GET_ACTIVE_TAB.payment_terms }}</p>
					<p>{{ GET_ACTIVE_TAB.phone }}</p>
					<p>{{ GET_ACTIVE_TAB.state }}</p>
					<p>{{ GET_ACTIVE_TAB.tax_id_number }}</p>
					<p>{{ GET_ACTIVE_TAB.trip_exp_calculation }}</p>
					<p>{{ GET_ACTIVE_TAB.updated_at }}</p>
					<p>{{ GET_ACTIVE_TAB.vendor_category.active }}</p>
					<p>{{ GET_ACTIVE_TAB.vendor_category.created_at }}</p>
					<p>{{ GET_ACTIVE_TAB.vendor_category.description }}</p>
					<p>{{ GET_ACTIVE_TAB.vendor_category.id }}</p>
					<p>{{ GET_ACTIVE_TAB.vendor_category.name }}</p>
					<p>{{ GET_ACTIVE_TAB.vendor_category.updated_at }}</p>
				</div>
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

			// pull in vendors
			store.GET_ALL_VENDORS();

			return {
				route,
				searchText: ref(""),
				showVendor(vendorInfo) {
					store.CREATE_NEW_TAB(vendorInfo);
				},
			};
		},
		components: {
			PageTabs,
		},
		computed: {
			...mapState(useVendors, ["GET_VENDORS", "GET_FILTERED_VENDORS", "GET_ACTIVE_TAB"]),
		},
		methods: {
			...mapActions(useVendors, ["FILTER_LIST", "SET_SEARCH_TERM", "CREATE_NEW_TAB"]),
			search() {
				this.SET_SEARCH_TERM(this.searchText);
				this.FILTER_LIST(this.searchText);
			},
		},
	};
</script>
