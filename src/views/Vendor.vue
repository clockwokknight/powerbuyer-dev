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

	const { data: vendor, isFetching } = useQuery(
		["product", routeParamId],
		() =>
			vendors.retrieve(routeParamId.value).then((res) => {
				store.SET_SELECTED_TAB(res.data);
				// console.log(store.GET_SELECTED_TAB);
				return res.data;
			})
		// axios.get(`/vendors/${routeParamId.value}`).then((res) => res.data)
	);

	// const obj = {
	// 	price: "",
	// 	randomText: "",
	// 	phoneNumber: "",
	// };

	// const getSelectedData = (attr) => {
	// 	setTimeout(() => {
	// 		return store.GET_SELECTED_TAB.attr;
	// 	}, 2000);
	// };

	const obj = {
		name: "",
		address_one: "",
		accounting_code: "",
		city: "",
		state: "",
		payment_terms: "",
		zip: "",
		phone: "",
	};
	const isLoading = ref(false);
	const dataFromServer = reactive({ ...vendor.value });
	const form = reactive({ ...vendor.value });

	const onChange = (key, val) => {
		isLoading.value = true;
		const dataToSend = { ...store.GET_SELECTED_TAB };
		// console.log(dataToSend);
		dataFromServer[key] = val;

		const sendToAPI = {
			id: dataToSend.id,
			name: dataToSend.name,
			din: "1234567890",
			// din: dataToSend.din,
			payment_terms: dataToSend.name,
			address_one: dataToSend.address_one,
			address_two: "TEST",
			// address_two: dataToSend.address_two,
			city: dataToSend.city,
			state: dataToSend.state,
			country: dataToSend.country,
			zip: dataToSend.zip,
			// phone: "1234567890",
			phone: dataToSend.phone,
			fax: "1234567890",
			// fax: dataToSend.fax,
			email: "test@test.com",
			// email: dataToSend.email,
			trip_exp_calculation: dataToSend.trip_exp_calculation,
		};
		// console.log(sendToAPI);
		vendors.create(sendToAPI).then((res) => {
			console.log("Working Properly");
			store.SET_SELECTED_TAB({ ...sendToAPI });
		});

		debounceChange();
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
			<!-- <n-form-item label="phone">
			<updatable-button-wrapper
				v-model="form.phoneNumber"
				:reset-value="vendor?.phoneNumber"
				@save="(val) => onChange('phoneNumber', val)"
			>
				<masked-input mask="(###) ###-####" v-model:value="form.phoneNumber" />
			</updatable-button-wrapper>
		</n-form-item>
		<n-form-item label="Price">
			<updatable-button-wrapper
				v-model="form.price"
				:reset-value="vendor?.price"
				@save="(val) => onChange('price', val)"
			>
				<currency-input v-model="form.price" :loading="isLoading" />
			</updatable-button-wrapper>
		</n-form-item> -->
			{{ vendor?.name }}
			<n-form-item label="Name">
				<UpdatableButtonWrapper
					v-model="form.name"
					:reset-value="vendor?.name"
					@save="(val) => onChange('name', val)"
				>
					<n-input
						:default-value="store.GET_SELECTED_TAB.name"
						v-model:value="form.name"
					/> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="Address">
				<UpdatableButtonWrapper
					v-model="form.address_one"
					:reset-value="vendor?.address_one"
					@save="(val) => onChange('address_one', val)"
				>
					<n-input
						:default-value="store.GET_SELECTED_TAB.address_on"
						v-model:value="form.address_one"
					/> </UpdatableButtonWrapper
			></n-form-item>
			<n-form-item label="Account #">
				<UpdatableButtonWrapper
					v-model="form.accounting_code"
					:reset-value="vendor?.accounting_code"
					@save="(val) => onChange('accounting_code', val)"
				>
					<n-input
						:default-value="store.GET_SELECTED_TAB.accounting_code"
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
						:default-value="store.GET_SELECTED_TAB.city"
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
						:default-value="store.GET_SELECTED_TAB.state"
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
						:default-value="store.GET_SELECTED_TAB.payment_terms"
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
						:default-value="store.GET_SELECTED_TAB.zip"
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
						:default-value="store.GET_SELECTED_TAB.phone"
						mask="(###) ###-####"
						v-model:value="form.phone"
					/>
				</updatable-button-wrapper>
			</n-form-item>
		</n-form>
	</div>
</template>
