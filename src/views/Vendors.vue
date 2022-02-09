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
				<div>
					<div class="pl-5 mt-10">
						<div :key="GET_ACTIVE_TAB" v-if="GET_ACTIVE_TAB.id">
							<div id="form-area">
								<n-form>
									<n-form-item label="Name">
										<UpdatableButtonWrapper
											v-model="form.name"
											:reset-value="GET_ACTIVE_TAB.name"
											@save="(val) => onChange('name', val)"
										>
											<n-input
												v-model:value="form.name"
												:default-value="GET_ACTIVE_TAB.name"
											/> </UpdatableButtonWrapper
									></n-form-item>
									<n-form-item label="Address">
										<UpdatableButtonWrapper
											v-model="form.address_one"
											:reset-value="GET_ACTIVE_TAB.address_one"
											@save="(val) => onChange('address', val)"
										>
											<n-input
												v-model:value="form.address_one"
												:default-value="GET_ACTIVE_TAB.address_one"
											/> </UpdatableButtonWrapper
									></n-form-item>
									<n-form-item label="Account No">
										<UpdatableButtonWrapper
											v-model="form.accounting_code"
											:reset-value="GET_ACTIVE_TAB.accounting_code"
											@save="(val) => onChange('accounting_code', val)"
										>
											<n-input
												v-model:value="form.accounting_code"
												:default-value="GET_ACTIVE_TAB.accounting_code"
											/> </UpdatableButtonWrapper
									></n-form-item>
									<n-form-item label="City">
										<UpdatableButtonWrapper
											v-model="form.city"
											:reset-value="GET_ACTIVE_TAB.city"
											@save="(val) => onChange('city', val)"
										>
											<n-input
												v-model:value="form.city"
												:default-value="GET_ACTIVE_TAB.city"
											/> </UpdatableButtonWrapper
									></n-form-item>
									<n-form-item label="State">
										<UpdatableButtonWrapper
											v-model="form.state"
											:reset-value="GET_ACTIVE_TAB.state"
											@save="(val) => onChange('state', val)"
										>
											<n-input
												v-model:value="form.state"
												:default-value="GET_ACTIVE_TAB.state"
											/> </UpdatableButtonWrapper
									></n-form-item>
									<n-form-item label="Payment Terms">
										<UpdatableButtonWrapper
											v-model="form.payment_terms"
											:reset-value="GET_ACTIVE_TAB.payment_terms"
											@save="(val) => onChange('payment_terms', val)"
										>
											<n-input
												v-model:value="form.payment_terms"
												:default-value="GET_ACTIVE_TAB.payment_terms"
											/> </UpdatableButtonWrapper
									></n-form-item>
									<n-form-item label="Zip">
										<updatable-button-wrapper
											v-model="form.zip"
											:reset-value="GET_ACTIVE_TAB.zip"
											@save="(val) => onChange('zip', val)"
										>
											<masked-input
												mask="#####"
												v-model:value="form.zip"
												:default-value="GET_ACTIVE_TAB.zip"
											/>
										</updatable-button-wrapper>
									</n-form-item>
									<n-form-item label="Phone">
										<updatable-button-wrapper
											v-model="form.phone"
											:reset-value="GET_ACTIVE_TAB.phone"
											@save="(val) => onChange('phone', val)"
										>
											<masked-input
												mask="(###) ###-####"
												v-model:value="form.phone"
												:default-value="GET_ACTIVE_TAB.phone"
											/>
										</updatable-button-wrapper>
									</n-form-item>
								</n-form>
							</div>
						</div>
					</div>
					<!-- <p>{{ GET_ACTIVE_TAB.accounting_code }}</p>
					<p>{{ GET_ACTIVE_TAB.address_one }}</p>
					<p>{{ GET_ACTIVE_TAB.address_two }}</p>
					<p>{{ GET_ACTIVE_TAB.city }}</p>
					<p>{{ GET_ACTIVE_TAB.comments }}</p>
					<p>{{ GET_ACTIVE_TAB.country }}</p>
					<p>{{ GET_ACTIVE_TAB.created_at }}</p>
					<p>{{ GET_ACTIVE_TAB.din }}</p>
					<p>{{ GET_ACTIVE_TAB.email }}</p>
					<p>{{ GET_ACTIVE_TAB.id }}</p>
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
					<p>{{ GET_ACTIVE_TAB.vendor_category.updated_at }}</p> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { useRoute } from "vue-router";
	import { mapActions, mapState } from "pinia";
	import { useVendors } from "@/store/vendors";
	import { reactive, ref } from "vue";
	import PageTabs from "@/components/PageTabs.vue";
	import CurrencyInput from "@/components/common/CurrencyInput.vue";
	import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
	import MaskedInput from "@/components/common/MaskedInput.vue";
	import { useDebounceFn } from "@vueuse/core";
	import vendors from "@/api/vendors";

	export default {
		components: {
			CurrencyInput,
			UpdatableButtonWrapper,
			MaskedInput,
			PageTabs,
		},
		setup() {
			const route = useRoute();
			const store = useVendors();

			// import {co} from "@vueuse/core"
			const obj = {
				name: "",
				address_one: "",
				accounting_code: "",
				city: "",
				state: "",
				payment_terms: "",
				zip: null,
				phone: "",
			};
			const isLoading = ref(false);

			const onChange = (key, val) => {
				isLoading.value = true;
				// make POST api call with id to save and store data in database
				// for only the active tab
				console.log(val);
				const dataToSend = { ...store.GET_ACTIVE_TAB };
				dataToSend[key] = val;

				const sendToAPI = {
					id: dataToSend.id,
					name: dataToSend.name,
					din: "Change These Later",
					// din: dataToSend.din,
					payment_terms: dataToSend.name,
					address_one: dataToSend.address_one,
					address_two: dataToSend.address_two,
					city: dataToSend.city,
					state: dataToSend.state,
					country: dataToSend.country,
					zip: dataToSend.zip,
					phone: dataToSend.phone,
					fax: 1234567890,
					email: dataToSend.email,
					trip_exp_calculation: dataToSend.trip_exp_calculation,
				};

				vendors.create(sendToAPI).then((res) => console.log("Working Properly"));
				debounceChange();
			};
			const debounceChange = useDebounceFn(() => {
				isLoading.value = false;
			}, 1000);

			// pull in vendors
			store.GET_ALL_VENDORS();

			return {
				route,
				form: reactive({ ...store.GET_ACTIVE_TAB }),
				onChange,
				isLoading,
				searchText: ref(""),
				showVendor(vendorInfo) {
					store.CREATE_NEW_TAB(vendorInfo);
				},
			};
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
