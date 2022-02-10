<script setup>
	import { useQuery } from "vue-query";
	import { useRoute } from "vue-router";
	import { reactive, ref, watch } from "vue";
	import vendors from "@/api/vendors";
	import { useDebounceFn } from "@vueuse/core";
	import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
	import MaskedInput from "@/components/common/MaskedInput.vue";
	import CurrencyInput from "@/components/common/CurrencyInput.vue";
	import { useVendors } from "@/store/vendors";

	const route = useRoute();
	const store = useVendors();

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
			din: "1234567890",
			// din: dataFromServer.din,
			payment_terms: dataFromServer.name,
			address_one: dataFromServer.address_one,
			address_two: "TEST",
			// address_two: dataFromServer.address_two,
			city: dataFromServer.city,
			state: dataFromServer.state,
			country: dataFromServer.country,
			zip: dataFromServer.zip,
			// phone: "1234567890",
			phone: dataFromServer.phone,
			fax: "1234567890",
			// fax: dataFromServer.fax,
			email: "test@test.com",
			// email: dataFromServer.email,
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
</script>

<template>
	<div class="px-4" v-if="!isLoading">
		<div class="flex gap-x-3">Name: {{ vendor?.name }}</div>
		<div class="flex gap-x-3">Tax ID Number: {{ vendor?.tax_id_number }}</div>
		<div class="flex gap-x-3">Address: {{ vendor?.address_one }}</div>
		<div class="flex gap-x-3">City: {{ vendor?.city }}, State: {{ vendor?.state }}</div>
	</div>

	<div class="mt-4 px-4">
		<n-form>
			{{ vendor?.name }}
			<n-form-item label="Name">
				<UpdatableButtonWrapper
					v-model="form.name"
					:reset-value="dataFromServer.name"
					@save="(val) => onChange('name', val)"
				>
					<n-input v-model:value="form.name" /> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="Address">
				<UpdatableButtonWrapper
					v-model="form.address_one"
					:reset-value="vendor?.address_one"
					@save="(val) => onChange('address_one', val)"
				>
					<n-input v-model:value="form.address_one" /> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="Account #">
				<UpdatableButtonWrapper
					v-model="form.accounting_code"
					:reset-value="vendor?.accounting_code"
					@save="(val) => onChange('accounting_code', val)"
				>
					<n-input
						:default-value="vendor?.accounting_code"
						v-model:value="form.accounting_code"
					/> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="City">
				<UpdatableButtonWrapper
					v-model="form.city"
					:reset-value="vendor?.city"
					@save="(val) => onChange('city', val)"
				>
					<n-input
						:default-value="vendor?.city"
						v-model:value="form.city"
					/> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="State">
				<UpdatableButtonWrapper
					v-model="form.state"
					:reset-value="vendor?.state"
					@save="(val) => onChange('state', val)"
				>
					<n-input
						:default-value="vendor?.state"
						v-model:value="form.state"
					/> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="Net Terms">
				<UpdatableButtonWrapper
					v-model="form.payment_terms"
					:reset-value="vendor?.payment_terms"
					@save="(val) => onChange('payment_terms', val)"
				>
					<n-input
						:default-value="vendor?.payment_terms"
						v-model:value="form.payment_terms"
					/> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="Zip">
				<updatable-button-wrapper
					v-model="form.zip"
					:reset-value="vendor?.zip"
					@save="(val) => onChange('zip', val)"
				>
					<masked-input
						:default-value="vendor?.zip"
						mask="#####"
						v-model:value="form.zip"
					/>
				</updatable-button-wrapper>
			</n-form-item>
			<n-form-item label="Phone">
				<updatable-button-wrapper
					v-model="form.phone"
					:reset-value="vendor?.phone"
					@save="(val) => onChange('phone', val)"
				>
					<masked-input
						:default-value="vendor?.phone"
						mask="(###) ###-####"
						v-model:value="form.phone"
					/>
				</updatable-button-wrapper>
			</n-form-item>
		</n-form>
	</div>
	<!-- <div class="px-4">
		<n-data-table
			:columns="expensesColumns"
			:data="expensesData"
			:pagination="pagination"
			:bordered="false"
		/>
	</div>

	<div class="px-4">
		<n-data-table
			:columns="invoicesColumns"
			:data="invoicesData"
			:pagination="pagination"
			:bordered="false"
		/>
	</div> -->
</template>
