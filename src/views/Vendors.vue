<script setup>
	import { onUpdated, ref, watch } from "vue";
	import { useInfiniteQuery, useQuery } from "vue-query";
	import axios from "axios";
	import { TabGroup, TabList, Tab } from "@headlessui/vue";
	import { useRoute, useRouter } from "vue-router";
	import { useDebounceFn, useDebounce } from "@vueuse/core";

	import { useLoadingBar } from "naive-ui";
	import VendorList from "@/components/vendor/VendorList.vue";

	const router = useRouter();
	const route = useRoute();
	const loadingBar = useLoadingBar();

	const searchText = ref("");
	const debouncedSearchText = useDebounce(searchText, 500);

	const selectedIndex = ref(1);
	const tabListButton = ref(null);
	const tabListButtonWrapper = ref(null);
	const showScrollArrow = ref(false);
	const scrollWrapper = ref(null);
	// Left and right Click Arrow Scroll
	const ifScrollArrowNeeded = () => {
		const wrapperWidth = tabListButtonWrapper.value?.getBoundingClientRect().width;
		const tabWidth = tabListButton.value?.getBoundingClientRect().width;

		showScrollArrow.value = wrapperWidth < tabWidth;
	};

	onUpdated(() => {
		ifScrollArrowNeeded();
	});

	const scrollTo = (type) => {
		const scrollLeft = scrollWrapper.value.scrollLeft;

		if (type === "left") {
			scrollWrapper.value.scrollTo({ left: scrollLeft - 50, behavior: "smooth" });
		} else {
			scrollWrapper.value.scrollTo({ left: scrollLeft + 50, behavior: "smooth" });
		}
	};
	// Showing All Vendors
	const {
		data: vendors,
		hasNextPage: hasVendorNextPage,
		fetchNextPage: vendorFetchNextPage,
	} = useInfiniteQuery(
		"vendors",
		({ pageParam = 1 }) => axios.get("/vendors?page=" + pageParam).then((r) => r.data),
		{
			getNextPageParam: (lastPage, pages) =>
				lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : null,
		}
	);

	// Fetching Vendor tabs based on user
	const { data: vendorTabs } = useQuery("vendorTabs", () =>
		axios.get("/user_ui_tabs/1/vendors").then((res) => res.data)
	);
	const tablist = ref([
		{
			id: 1,
			name: "*** Mated Laija",
		},
		{
			id: 5,
			name: "*** Vendor Marcos",
		},
	]);
	const findTabIndex = (id) => tablist.value.findIndex((tab) => tab.id === id);

	const closeTab = (id) => {
		if (tablist.value.length === 1) return;
		const index = findTabIndex(id);

		if (parseInt(route.params?.id) === tablist.value[index].id) {
			router.push(`/vendors/${tablist.value[index === 0 ? index + 1 : index - 1].id}`);
		}
		tablist.value.splice(index, 1);
	};
	const addTab = (vendor) => {
		loadingBar.start();
		const index = findTabIndex(vendor.id);
		if (index === -1) {
			tablist.value.push(vendor);
			selectedIndex.value = tablist.value.length - 1;
		} else selectedIndex.value = index;
		scrollTabToView();
	};

	const tabChanged = (index) => {
		console.log({ tabChanged: index });
		selectedIndex.value = index;
		scrollTabToView();
	};

	watch(selectedIndex, (newValue) => {
		loadingBar.start();
		if (parseInt(route.params?.id) !== tablist.value[newValue].id) {
			router.push(`/vendors/${tablist.value[newValue].id}`);
		}
	});

	const scrollTabToView = useDebounceFn(() => {
		const tabListChildren = tabListButton.value.children;
		for (let i = 0; i < tabListChildren.length; i++) {
			const tabIndex = parseInt(
				tabListChildren[i].getElementsByTagName("button")[0].getAttribute("tabindex")
			);
			if (tabIndex === 0) {
				tabListChildren[i].scrollIntoView({ behavior: "smooth" });
				break;
			}
		}
		loadingBar.finish();
	}, 100);

	// Vendor Search Result
	const { data: vendorSearchResults, isFetching: isVendorSearchFetching } = useQuery(
		["vendorSearch", debouncedSearchText],
		({ queryKey }) => {
			if (queryKey[1] === "") return null;
			else
				return axios.get(`/vendors/search/${queryKey[1]}`).then((res) => {
					if (res.data?.debug) {
						return [];
					}
					return res.data;
				});
		}
	);
</script>

<template>
	<div class="flex w-full vendors">
		<!-- Don't show PageItemsList on dashboard  | Current Page List -->
		<div
			class="relative pageItemsList min-w-[275px] max-w-[275px] h-screen overflow-y-auto overflow-x-hidden bg-white"
		>
			<!-- List search & filters -->
			<div class="sticky top-0 p-3 bg-white border-b">
				<div class="mb-3">
					<h1 class="text-xl font-bold uppercase">Vendors</h1>
				</div>
				<div class="flex">
					<div class="mr-3">
						<n-input
							v-model:value.trim="searchText"
							round
							clearable
							placeholder="Search..."
						/>
					</div>
					<div>
						<svg
							class="w-6 h-6 mt-1 text-gray-400 cursor-pointer hover:text-[#027bff]"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							viewBox="0 0 24 24"
						>
							<path
								d="M5.5 5h13a1 1 0 0 1 .5 1.5L14 12v7l-4-3v-4L5 6.5A1 1 0 0 1 5.5 5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</svg>
					</div>
				</div>
				<!-- Filter Component -->
			</div>
			<!-- Main Loop List -->
			<div class="">
				<ul class="">
					<template v-if="debouncedSearchText">
						<VendorList
							v-if="vendorSearchResults"
							:vendors="vendorSearchResults"
							@click:tab="addTab"
						/>
					</template>

					<template v-else>
						<template
							v-for="(vendorPage, vendorPageIdx) in vendors?.pages"
							:key="vendorPageIdx"
						>
							<VendorList :vendors="vendorPage.data" @click:tab="addTab" />
						</template>
						<button
							v-observe-visibility="
								(isVisible) => (isVisible ? vendorFetchNextPage() : null)
							"
							v-if="hasVendorNextPage"
							class="grid w-full p-4 place-content-center"
						>
							<svg
								class="w-6 h-6 mr-3 -ml-1 animate-spin text-emerald-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</button>
					</template>
				</ul>
			</div>
		</div>
		<!-- Main Tabs App Content -->
		<div class="w-[calc(100vw-335px)] h-screen">
			<TabGroup :selected-index="selectedIndex" @change="tabChanged">
				<div class="relative flex items-end" ref="tabListButtonWrapper">
					<div
						class="overflow-x-hidden bg-[#F8F8FA] h-[62px] flex items-end"
						ref="scrollWrapper"
					>
						<TabList>
							<div ref="tabListButton" class="flex gap-x-2 flex-nowrap min-w-max">
								<template
									v-for="tab in tablist"
									v-if="tablist.length >= 1"
									:key="tab?.id"
								>
									<router-link
										:to="{ name: 'SingleVendor', params: { id: tab?.id } }"
										custom
										v-slot="{ href, route, navigate, isActive }"
									>
										<div class="relative">
											<tab class="max-w-xs rounded-t focus:outline-none scroll-mt-2">
												<a
													:href="href"
													@click="navigate"
													class="block px-4 py-2 pr-6 overflow-hidden border-t rounded-t border-x focus:outline-none whitespace-nowrap truncate max-w-[250px]"
													:class="[
														isActive ? 'bg-primary text-white' : 'text-gray-700 bg-white',
													]"
												>
													{{ tab?.name }}
												</a>
											</tab>
											<span
												class="absolute inset-y-0 right-0 top-[1px] flex items-center pr-1 rounded-r z-10 cursor-pointer"
												@click.stop="closeTab(tab.id)"
												:class="[isActive ? 'bg-primary text-white' : 'bg-slate-white']"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													xmlns:xlink="http://www.w3.org/1999/xlink"
													class="w-5 h-5"
													:class="[
														isActive
															? 'bg-primary text-white hover:text-gray-300'
															: 'text-gray-200 hover:text-gray-400 bg-slate-white',
													]"
													fill="currentColor"
													viewBox="0 0 512 512"
												>
													<path
														d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
														fill="none"
														stroke="currentColor"
														stroke-miterlimit="10"
														stroke-width="32"
													></path>
													<path
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="32"
														d="M320 320L192 192"
													></path>
													<path
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="32"
														d="M192 320l128-128"
													></path>
												</svg>
											</span></div
									></router-link>
								</template>
							</div>
						</TabList>
					</div>
					<div class="flex h-[48px] bg-[#f8f8fa]">
						<button
							class="grid w-8 px-2 hover:text-[#027bff] place-content-center"
							v-if="showScrollArrow"
							@click="scrollTo('left')"
						>
							<svg
								class="w-4 h-4"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 24 24"
							>
								<path
									d="M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"
									fill="currentColor"
								></path>
							</svg>
						</button>
						<button
							class="grid w-8 px-2 hover:text-[#027bff] place-content-center"
							v-if="showScrollArrow"
							@click="scrollTo('right')"
						>
							<svg
								class="w-4 h-4"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 24 24"
							>
								<path
									d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31a.996.996 0 0 0 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"
									fill="currentColor"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</TabGroup>
			<!-- Main Body Content-->
			<div class="overflow-y-auto overflow-x-hidden h-[calc(100%-62px)] border-t-2">
				<div class="h-screen pt-10 bg-white">
					<router-view />
				</div>
			</div>
		</div>
	</div>
</template>
