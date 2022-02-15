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
	import VendorExpenses from "@/components/vendor/VendorExpenses.vue";
	import VendorInvoices from "@/components/vendor/VendorInvoices.vue";
	import VendorContacts from "@/components/vendor/VendorContacts.vue";
	import CurrencyInput from "@/components/common/CurrencyInput.vue";
	import { useVendors } from "@/store/vendors";
	import setup from "naive-ui/lib/radio/src/use-radio";
	
	const show = ref({
		name: false,
		din: false,
		payment_terms:false,
		accounting_code:false,
		vendor_category:false,
		address_one:false,
		address_two:false,
		city:false,
		state:false,
		zip:false,
		fax:false,
		phone:false,
		email:false,
		comments:false,
		tax_id_number:false,
	})

	const route = useRoute();
	const store = useVendors();

	const statelist = ref([]);
    
    const paymenttermslist = ref([]);

    const vendorcategorylist = ref([]);  

	const vendorcategoryswap = ref([]);  

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


	vendors.allCategories().then(({ data }) => (vendorcategoryswap.value = data.data))

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

					if (key == 'vendor_category'){

						return form[key] = vendor.value[key].name

					}
					else{
					form[key] = vendor.value[key]
					
					}
					dataFromServer[key] = vendor.value[key];

				});
			}
		}
	);

	const handleKeyUp = (val) => {
		show.value[val] = true;
	}

	const handleKeyDown = (val) => {
		show.value[val] = false;
	}



	const onChange = (key, val) => {
		//isLoading.value = true;
		dataFromServer[key] = val;

		const sendToAPI = {
			id: dataFromServer.id,
			name: dataFromServer.name,
			din: dataFromServer.din,
			payment_terms: dataFromServer.payment_terms,
			accounting_code: dataFromServer.accounting_code,
			address_one: dataFromServer.address_one,
			address_two: dataFromServer.address_two,
			city: dataFromServer.city,
			state: dataFromServer.state,
			country: dataFromServer.country,
			zip: dataFromServer.zip,
			phone: dataFromServer.phone,
			fax: dataFromServer.fax,
			email: dataFromServer.email,
			comment: dataFromServer.comment,
			trip_exp_calculation: dataFromServer.trip_exp_calculation,
		};
		// console.log(sendToAPI);
		vendors.create(sendToAPI).then((res) => {
			console.log("Vendor Updated Successfully");
			//isLoading.value = false;
			handleKeyDown(key)
			//debounceChange();
		});
	};

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
					:shouldUpdate="show.name"
					style="width:500px;" 
					@revert="handleKeyDown('name')"
					@save="(val) => onChange('name', val)"
				>
					<n-input 
					class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
					
					v-model:value="form.name" 
					:loading="isLoading"
					@keyup="handleKeyUp('name')"
										/> </UpdatableButtonWrapper
			>	<n-space>
								<n-form-item label="DIN" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.din"
										:reset-value="vendor?.din"
										:shouldUpdate="show.din"
										@revert="handleKeyDown('din')"
										@save="(val) => onChange('din', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.din"
											v-model:value="form.din"
											:loading="isLoading"
											@keyup="handleKeyUp('din')"
										/> </UpdatableButtonWrapper
								></n-form-item>
								<n-form-item label="Payment Terms">
									<UpdatableButtonWrapper
										v-model="form.payment_terms"
										:reset-value="vendor?.payment_terms"
										:shouldUpdate="show.payment_terms"
										@revert="handleKeyDown('payment_terms')"
										@save="(val) => onChange('payment_terms', val)"
									>
										
										<n-select
										style="width:220px;"
										class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
										placeholder="Select Payment Term"
										:options="paymenttermslist"
										:loading="isLoading"
										@update:value="handleKeyUp('payment_terms')"
										:default-value="vendor?.payment_terms"
										v-model:value="form.payment_terms"
										filterable
										/> </UpdatableButtonWrapper
								></n-form-item>
								</n-space>
  		<n-space>
		
   
		<n-form-item label="Account #">
									<UpdatableButtonWrapper
										v-model="form.accounting_code"
										:reset-value="vendor?.accounting_code"
										:shouldUpdate="show.accounting_code"
										@revert="handleKeyDown('accounting_code')"
										@save="(val) => onChange('accounting_code', val)"
									>
										<n-input style="width:500px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.accounting_code"
											v-model:value="form.accounting_code"
											:loading="isLoading"
											@keyup="handleKeyUp('accounting_code')"
										/> </UpdatableButtonWrapper
								></n-form-item>
								</n-space>
								<n-space>
								<n-form-item label="Vendor Category" class="pr-12">
								<UpdatableButtonWrapper
										v-model="form.vendor_category"
										:reset-value="vendor?.vendor_category.name"
										:shouldUpdate="show.vendor_category"
										@revert="handleKeyDown('vendor_category')"
										@save="(val) => onChange('vendor_category', val)"
									>
									<n-select style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
									placeholder="Select Vendor Category"
									:options="vendorcategorylist"
									:loading="isLoading"
									@update:value="handleKeyUp('vendor_category')"
									v-model:value="form.vendor_category"
									filterable
									/>
										 </UpdatableButtonWrapper
								>
								</n-form-item>
   
								<n-form-item label="Tax ID #">
									<UpdatableButtonWrapper
										v-model="form.tax_id_number"
										:reset-value="vendor?.tax_id_number"
										:shouldUpdate="show.tax_id_number"
										@revert="handleKeyDown('tax_id_number')"
										@save="(val) => onChange('tax_id_number', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.tax_id_number"
											v-model:value="form.tax_id_number"
											:loading="isLoading"
											@keyup="handleKeyUp('tax_id_number')"
										/> </UpdatableButtonWrapper
								></n-form-item>
								</n-space>
								<n-space>
									<n-form-item label="Address" class="pr-12">
									<UpdatableButtonWrapper
											v-model="form.address_one"
											:reset-value="vendor?.address_one"
											:shouldUpdate="show.address_one"
											@revert="handleKeyDown('address_one')"
											@save="(val) => onChange('address_one', val)"
										>
											<n-input 
											style="width:500px;" 
											class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											v-model:value="form.address_one"
											:loading="isLoading"
											@keyup="handleKeyUp('address_one')"
											 /> </UpdatableButtonWrapper
									>
									</n-form-item>
									
								</n-space>

								<n-space>
									<n-form-item label="Address Two" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.address_two"
										:reset-value="vendor?.address_two"
										:shouldUpdate="show.address_two"
										@revert="handleKeyDown('address_two')"
										@save="(val) => onChange('address_two', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.address_two"
											v-model:value="form.address_two"
											:loading="isLoading"
											@keyup="handleKeyUp('address_two')"
										/> </UpdatableButtonWrapper
								></n-form-item>
													<n-form-item label="City" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.city"
										:shouldUpdate="show.city"
										@revert="handleKeyDown('city')"
										:reset-value="vendor?.city"
										@save="(val) => onChange('city', val)"
									>
										<n-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.city"
											v-model:value="form.city"
											:loading="isLoading"
											@keyup="handleKeyUp('city')"
										/> </UpdatableButtonWrapper
								></n-form-item>


								<n-form-item label="State" class="pr-12">
									<UpdatableButtonWrapper
										v-model="form.state"
										:reset-value="vendor?.state"
										:shouldUpdate="show.state"
										@revert="handleKeyDown('state')"
										@save="(val) => onChange('state', val)"
									>
										<n-select style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
										placeholder="Select State"
										:options="statelist"
										:loading="isLoading"
										@update:value="handleKeyUp('state')"
										v-model:value="form.state"
										filterable
										/> </UpdatableButtonWrapper
								></n-form-item>
												
								<n-form-item label="Zip" class="pr-12">
									<updatable-button-wrapper
										v-model="form.zip"
										:shouldUpdate="show.zip"
										@revert="handleKeyDown('zip')"
										:reset-value="vendor?.zip"
										@save="(val) => onChange('zip', val)"
									>
										<masked-input class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.zip"
											mask="#####"
											
											style="width:220px;"
											:loading="isLoading"
											@keyup="handleKeyUp('zip')"
											v-model:value="form.zip"
										/>
									</updatable-button-wrapper>
								</n-form-item>
								
								</n-space>

								<n-space>
									<n-form-item label="Email" class="pr-12">
								<UpdatableButtonWrapper
										v-model="form.email"
										:shouldUpdate="show.email"
										@revert="handleKeyDown('email')"
										:reset-value="vendor?.email"
										
										@save="(val) => onChange('email', val)"
									>
										<n-input style="width:220px;" 
										class="border-2  rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
										:loading="isLoading"
										@keyup="handleKeyUp('email')"
										v-model:value="form.email" /> </UpdatableButtonWrapper
								>
								</n-form-item>
									<n-form-item label="Phone" class="pr-12">
									<updatable-button-wrapper
										v-model="form.phone"
										:shouldUpdate="show.phone"
										@revert="handleKeyDown('phone')"
										:reset-value="vendor?.phone"
										@save="(val) => onChange('phone', val)"
									>
										<masked-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.phone"
											mask="(###) ###-####"
											:loading="isLoading"
											@keyup="handleKeyUp('phone')"
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
								:shouldUpdate="show.fax"
								@revert="handleKeyDown('fax')"
								@save="(val) => onChange('fax', val)"
							>
								<masked-input style="width:220px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
									:default-value="vendor?.fax"
									mask="(###) ###-####"
									:loading="isLoading"
									@keyup="handleKeyUp('fax')"
									v-model:value="form.fax"
								/>
							</updatable-button-wrapper>

							
						</n-form-item>
   
								
								</n-space>
								<n-form-item label="Comments">
									<UpdatableButtonWrapper
										v-model="form.comments"
										:reset-value="vendor?.comments"
										:shouldUpdate="show.comments"
										@revert="handleKeyDown('comments')"
										@save="(val) => onChange('comments', val)"
									>
										<n-input class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="vendor?.comments"
											type="textarea"
											placeholder="Enter Comments"
											show-count
											:loading="isLoading"
											@keyup="handleKeyUp('comments')"
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

<VendorContacts/>
<VendorExpenses/>
</template>
