<template>
	<div class="flex w-full vendors">
		<!-- Don't show PageItemsList on dashboard  | Current Page List -->
		<div
			class="relative pageItemsList min-w-[275px] max-w-[275px] h-screen overflow-auto overflow-x-hidden bg-white"
		>
			<!-- List search & filters -->
			<div class="sticky top-0 p-3 bg-white">
				<div>Page Title</div>
				<div class="flex">
					<div class="mr-3">
						<n-input
							round
							placeholder="Search..."
							v-model:value="searchTerm"
							v-on:input="search()"
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
					<VendorList />
				</ul>
			</div>
		</div>
		<!-- Main Tabs App Content -->
		<div class="w-full h-screen">
			<div class="flex justify-between w-full h-14">
				<div class="pageTabs">
					<div>
						<!-- Page tabs -->
					</div>
				</div>
			</div>
			<!-- Main Body Content-->
			<div class="h-screen overflow-auto overflow-x-hidden bg-white">
				<!-- Body Content -->
				<PageTabs />
			</div>
		</div>
	</div>
</template>

<script>
	import store from "@/store";
	import { defineComponent, ref } from "vue";
	import { mapActions } from "vuex";
	import PageTabs from "@/components/PageTabs.vue";
	import VendorList from "@/components/vendors/VendorList.vue";

	export default defineComponent({
		setup() {
			return {
				searchTerm: ref(""),
			};
		},
		components: {
			VendorList,
			PageTabs,
		},
		methods: {
			...mapActions(["UPDATE_VENDORS_LIST"]),
			search() {
				// console.log(this.searchTerm);
				store.dispatch("UPDATE_VENDORS_LIST", this.searchTerm);
			},
		},
	});
</script>
