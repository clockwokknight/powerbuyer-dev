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
						<n-input round placeholder="Search..." />
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
						<PageTabs />
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
	import VendorList from "@/components/vendors/VendorList.vue";
	import { useRoute } from "vue-router";
	import PageTabs from "@/components/PageTabs.vue";
	export default {
		setup() {
			const route = useRoute();
			return {
				route,
			};
		},
		components: {
			VendorList,
			PageTabs,
		},
	};
</script>
