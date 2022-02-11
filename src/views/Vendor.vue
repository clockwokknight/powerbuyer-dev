<script setup>
	import { useQuery } from "vue-query";
	import { useRoute } from "vue-router";
	import { reactive, ref, watch } from "vue";
	import vendors from "@/api/vendors";
	import payments from "@/api/paymentterms";
	import states from "@/api/states";
	import { useDebounceFn } from "@vueuse/core";
	import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
	import MaskedInput from "@/components/common/MaskedInput.vue";
	import CurrencyInput from "@/components/common/CurrencyInput.vue";
	import { useVendors } from "@/store/vendors";

	const route = useRoute();
	const store = useVendors();
	let expenseItems = ref([]);
	let expenseItemsData = ref([]);
	let vendorContacts = ref([]);
	let vendorContactsData = ref([]);
	let vendorPayments = ref([]);
	let vendorPaymentsData = ref([]);
	let expenses = ref([]);
	let expensesData = ref([]);

	const statelist = ref([]);
    
    const paymenttermslist = ref([]);

    const vendorcategorylist = ref([]);  

	states.all().then(({ data }) => (statelist.value = data.map(el => el.name).map(
       (v) => ({
          label: v,
          value: v
       })
    )))

    payments.all().then(({ data }) => (paymenttermslist.value = data.map(el => el.name).map(
       (v) => ({
          label: v,
          value: v
       })
    )))

    vendors.allCategories().then(({ data }) => (vendorcategorylist.value = data.data.map(el => el.name).map(
       (v) => ({
          label: v,
          value: v
       })
	)))

	const routeParamId = ref(route.params?.id);
	watch(
		() => route.params?.id,
		() => {
			routeParamId.value = route.params?.id;
		}
	);

	// let vendor = ref({});
	const { data: vendor, isFetching } = useQuery(["product", routeParamId], () =>
		vendors.retrieve(routeParamId.value).then((res) => res.data)
	);

	const isLoading = ref(false);
	let form = reactive({});
	let dataFromServer = reactive({});
	watch(
		() => vendor.value,
		(newValue) => {
			if (newValue) {
				Object.keys(vendor.value).map((key) => {
					form[key] = vendor.value[key];
					dataFromServer[key] = vendor.value[key];
					// console.log(dataFromServer.value);
				});
			}
		}
	);

	const onChange = (key, val) => {
		isLoading.value = true;
		dataFromServer[key] = val;

		const sendToAPI = {
			id: dataFromServer.id,
			name: dataFromServer.name,
			//din: "1234567890",
			 din: dataFromServer.din,
			payment_terms: dataFromServer.name,
			address_one: dataFromServer.address_one,
			//address_two: "TEST",
			address_two: dataFromServer.address_two,
			city: dataFromServer.city,
			state: dataFromServer.state,
			country: dataFromServer.country,
			zip: dataFromServer.zip,
			// phone: "1234567890",
			phone: dataFromServer.phone,
			//fax: "1234567890",
			fax: dataFromServer.fax,
			//@ts-checkemail: "test@test.com",
			email: dataFromServer.email,
			trip_exp_calculation: dataFromServer.trip_exp_calculation,
		};
		// console.log(sendToAPI);
		vendors.create(sendToAPI).then((res) => {
			console.log("Vendor Updated Successfully");
			debounceChange();
		});
	};
	const debounceChange = useDebounceFn(() => {
		isLoading.value = false;
	}, 1000);
const vendorContactsColumns = [
		{
			title: "Name",
			key: "name",
		},
		{
			title: "Phone",
			key: "phone",
		},
		{
			title: "Email",
			key: "email",
		},
		{
			title: "Position",
			key: "position",
		},
		{
			title: "",
			key: "edit",
			render(row) {
				return h(
					NButton,
					{
						strong: true,
						tertiary: true,
						size: "medium",
						onClick: () => console.log(row),
					},
					{ default: () => "View/Edit" }
				);
			},
		},
	];
	const vendorPaymentsColumns = [
		{
			title: "Inv #",
			key: "inv_no",
		},
		{
			title: "Check Number",
			key: "check_number",
		},
		{
			title: "Amount",
			key: "amount",
		},
		{
			title: "Status",
			key: "status",
		},
		{
			title: "Payment Date",
			key: "payment_date",
		},
		{
			title: "",
			key: "edit",
			render(row) {
				return h(
					NButton,
					{
						strong: true,
						tertiary: true,
						size: "medium",
						onClick: () => console.log(row),
					},
					{ default: () => "View/Edit" }
				);
			},
		},
	];
	const expensesColumns = [
		{
			title: "Inv #",
			key: "inv_no",
		},
		{
			title: "Check Number",
			key: "check_number",
		},
		{
			title: "Amount",
			key: "amount",
		},
		{
			title: "Status",
			key: "status",
		},
		{
			title: "Payment Date",
			key: "payment_date",
		},
		{
			title: "",
			key: "edit",
			render(row) {
				return h(
					NButton,
					{
						strong: true,
						tertiary: true,
						size: "medium",
						onClick: () => console.log(row),
					},
					{ default: () => "View/Edit" }
				);
			},
		},
	];
	// LOAD TABLE DATA
</script>

<template>
	<!-- <div class="px-4" v-if="!isLoading">
		<div class="flex gap-x-3">Name: {{ vendor?.name }}</div>
		<div class="flex gap-x-3">Tax ID Number: {{ vendor?.tax_id_number }}</div>
		<div class="flex gap-x-3">Address: {{ vendor?.address_one }}</div>
		<div class="flex gap-x-3">City: {{ vendor?.city }}, State: {{ vendor?.state }}</div>
	</div> -->
	
	<div class="mt-4 px-4 antialiased pb-8">
		
		
			<div class="py-8 px-8 bg-slate-100 rounded-lg border-4 bg-gray-50">
		<div class="flex rounded-md border-10 border-gray-500">
		<div >

	  	<div class="w-1/2" ><p class="text-2xl font-bold">Vendor</p></div>
		  
		 <n-form class="w-full">
				<UpdatableButtonWrapper class="py-8"
					v-model="form.name"
					:reset-value="dataFromServer.name"
					@save="(val) => onChange('name', val)"
				>
					<n-input class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" style="width:500px;" v-model:value="form.name" /> </UpdatableButtonWrapper
			>	<n-space>
								<n-form-item label="DIN" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.din"
										:reset-value="vendor?.din"
										@save="(val) => onChange('din', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.din"
											v-model:value="form.din"
										/> </UpdatableButtonWrapper
								></n-form-item>
								<n-form-item label="Payment Terms">
									<UpdatableButtonWrapper
										v-model="form.payment_terms"
										:reset-value="vendor?.payment_terms"
										@save="(val) => onChange('payment_terms', val)"
									>
										
										<n-select
										style="width:220px;"
										class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
										placeholder="Select Payment Term"
										:options="paymenttermslist"
										:default-value="vendor?.payment_terms"
										v-model:value="form.payment_terms"
										filterable
										/> </UpdatableButtonWrapper
								></n-form-item>
								</n-space>
  		<n-space>
		<n-form-item label="Address #" class="pr-12">
								<UpdatableButtonWrapper
										v-model="form.address_one"
										:reset-value="vendor?.address_one"
										@save="(val) => onChange('address_one', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" v-model:value="form.address_one" /> </UpdatableButtonWrapper
								>
								</n-form-item>
   
		<n-form-item label="Account #">
									<UpdatableButtonWrapper
										v-model="form.accounting_code"
										:reset-value="vendor?.accounting_code"
										@save="(val) => onChange('accounting_code', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.accounting_code"
											v-model:value="form.accounting_code"
										/> </UpdatableButtonWrapper
								></n-form-item>
								</n-space>
								<n-space>
								<n-form-item label="Vendor Category" class="pr-12">
								<UpdatableButtonWrapper
										v-model="form.vendor_category_id"
										:reset-value="vendor?.vendor_category_id"
										@save="(val) => onChange('vendor_category_id', val)"
									>
									<n-select style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
									placeholder="Select Vendor Category"
									:options="vendorcategorylist"
									v-model:value="form.vendor_category_id"
									filterable
									/>
										 </UpdatableButtonWrapper
								>
								</n-form-item>
   
								<n-form-item label="Tax ID #">
									<UpdatableButtonWrapper
										v-model="form.tax_id_number"
										:reset-value="vendor?.tax_id_number"
										@save="(val) => onChange('tax_id_number', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.tax_id_number"
											v-model:value="form.tax_id_number"
										/> </UpdatableButtonWrapper
								></n-form-item>
								</n-space>
								<n-space>
									<n-form-item label="Address" class="pr-12">
									<UpdatableButtonWrapper
											v-model="form.address_one"
											:reset-value="vendor?.address_one"
											@save="(val) => onChange('address_one', val)"
										>
											<n-input style="width:500px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" v-model:value="form.address_one" /> </UpdatableButtonWrapper
									>
									</n-form-item>
									
								</n-space>

								<n-space>
									<n-form-item label="Address Two" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.address_two"
										:reset-value="vendor?.address_two"
										@save="(val) => onChange('address_two', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.address_two"
											v-model:value="form.address_two"
										/> </UpdatableButtonWrapper
								></n-form-item>
													<n-form-item label="City" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.city"
										:reset-value="vendor?.city"
										@save="(val) => onChange('city', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.city"
											v-model:value="form.city"
										/> </UpdatableButtonWrapper
								></n-form-item>
												
								<n-form-item label="Zip" class="pr-12">
									<updatable-button-wrapper
										v-model="form.zip"
										:reset-value="vendor?.zip"
										@save="(val) => onChange('zip', val)"
									>
										<masked-input class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.zip"
											mask="#####"
											style="width:80px;"
											v-model:value="form.zip"
										/>
									</updatable-button-wrapper>
								</n-form-item>
								
								</n-space>

								<n-space>
									<n-form-item label="Email" class="pr-12">
								<UpdatableButtonWrapper
										v-model="form.email"
										:reset-value="vendor?.email"
										@save="(val) => onChange('email', val)"
									>
										<n-input style="width:220px;" class="border-2  rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" v-model:value="form.email" /> </UpdatableButtonWrapper
								>
								</n-form-item>
									<n-form-item label="Phone" class="pr-12">
									<updatable-button-wrapper
										v-model="form.phone"
										:reset-value="vendor?.phone"
										@save="(val) => onChange('phone', val)"
									>
										<masked-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.phone"
											mask="(###) ###-####"
											v-model:value="form.phone"
										/>
									</updatable-button-wrapper>
								</n-form-item>
									
								</n-space>
								<n-space>
								<n-form-item label="Fax">
							<updatable-button-wrapper
								v-model="form.fax"
								:reset-value="vendor?.fax"
								@save="(val) => onChange('fax', val)"
							>
								<masked-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
									:default-value="vendor?.fax"
									mask="(###) ###-####"
									v-model:value="form.fax"
								/>
							</updatable-button-wrapper>

							
						</n-form-item>
   
								
								</n-space>
								<n-form-item label="Comments">
									<UpdatableButtonWrapper
										v-model="form.comments"
										:reset-value="vendor?.comments"
										
										@save="(val) => onChange('comments', val)"
									>
										<n-input class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.comments"
											type="textarea"
											placeholder="Enter Comments"
											show-count
											style="width:500px;" 
											v-model:value="form.comments"
										/> </UpdatableButtonWrapper
								>
								</n-form-item>
								
		</n-form>
  </div>
  <div class="w-1/2  h-15 place-items-end">
	  <div class="flex justify-end ">
	  <p class="text-sm font-bold ">Open Invoices </p>
	  </div>
	  <div class="flex justify-end pb-20">
	  <p class="font-bold" style="font-size: 2.5em;">$10,193</p>
	  </div>
	  
		
  </div>
</div>
		<div class="flex justify-end">
			<n-space>
			<button style="height:140px; max-width: 120px;" class="bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border-2 border-gray-400 hover:border-transparent rounded">
			<div >
				<n-icon>
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
			</n-icon>
			</div>
			Create Expense
			</button>
			<button style="height:140px; max-width: 120px;" class="bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border-2 border-gray-400 hover:border-transparent rounded">
			<div >
				<n-icon>
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
			</n-icon>
			</div>
			Create Invoice
			</button>
			<button style="height:140px; max-width: 120px;" class="min-w-20px bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border-2 border-gray-400 hover:border-transparent rounded">
			<div >
				<n-icon>
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
			</n-icon>
			</div>
			Create Purchase Order
			</button>
			</n-space>
		</div>
</div>
	

</div>

<!-- EXPENSE ITEMS TABLE DATA - begin -->
	<div class="px-4">
		<h2 class="font-bold">Expense Items</h2>
		<n-data-table
			:columns="expenseItemsColumns"
			:data="expenseItemsData"
			:pagination="true"
			:bordered="true"
		/>
	</div>
	<!-- EXPENSE ITEMS TABLE DATA - end -->
	<!-- VENDOR CONTACTS DATA - begin -->
	<div class="px-4">
		<h2 class="font-bold">Vendor Contacts</h2>
		<n-data-table
			:columns="vendorContactsColumns"
			:data="vendorContactsData"
			:pagination="true"
			:bordered="true"
		/>
	</div>
	<!-- VENDOR CONTACTS DATA - end -->
	<!-- VENDOR PAYMENTS DATA - begin -->
	<div class="px-4">
		<h2 class="font-bold">Vendor Payments</h2>
		<n-data-table
			:columns="vendorPaymentsColumns"
			:data="vendorPaymentsData"
			:pagination="true"
			:bordered="true"
		/>
	</div>
	<!-- VENDOR PAYMENTS DATA - end -->
	<!-- EXPENSES DATA - begin -->
	<div class="px-4">
		<h2 class="font-bold">Expenses</h2>
		<n-data-table
			:columns="expensesColumns"
			:data="expensesData"
			:pagination="true"
			:bordered="true"
		/>
	</div>
	<!-- EXPENSES DATA - end -->
	<!-- <div class="px-4">
		<n-data-table
			:columns="invoicesColumns"
			:data="invoicesData"
			:pagination="pagination"
			:bordered="false"
		/>
	</div> -->
</template>
