<script setup>
	import CurrencyInput from "@/components/common/CurrencyInput.vue";
	import { ref, reactive } from "vue";
	import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
	import { useDebounceFn } from "@vueuse/core";
	import MaskedInput from "@/components/common/MaskedInput.vue";
	// import {co} from "@vueuse/core"
	const obj = {
		price: "",
		randomText: "",
		phoneNumber: "",
	};
	const isLoading = ref(false);
	const dataFromServer = reactive({ ...obj });
	const form = reactive({ ...obj });

	const onChange = (key, val) => {
		isLoading.value = true;
		dataFromServer[key] = val;
		debounceChange();
	};
	const debounceChange = useDebounceFn(() => {
		isLoading.value = false;
	}, 1000);
</script>

<template>
	<div class="pl-5">
		<h1>Inventory</h1>
		<n-form>
			<n-form-item label="phone">
				<updatable-button-wrapper
					v-model="form.phoneNumber"
					:reset-value="dataFromServer.phoneNumber"
					@save="(val) => onChange('phoneNumber', val)"
				>
					<masked-input mask="(###) ###-####" v-model:value="form.phoneNumber" />
				</updatable-button-wrapper>
			</n-form-item>
			<n-form-item label="Price">
				<updatable-button-wrapper
					v-model="form.price"
					:reset-value="dataFromServer.price"
					@save="(val) => onChange('price', val)"
				>
					<currency-input v-model="form.price" :loading="isLoading" />
				</updatable-button-wrapper>
			</n-form-item>
			<n-form-item label="random-text">
				<UpdatableButtonWrapper
					v-model="form.randomText"
					:reset-value="dataFromServer.randomText"
					@save="(val) => onChange('randomText', val)"
				>
					<n-input v-model:value="form.randomText" /> </UpdatableButtonWrapper
			></n-form-item>
		</n-form>
	</div>
</template>
