<template>
<n-message-provider>
<div class="mt-4 px-4 font-sans antialiased">
    <div class="pb-4 justify-end"><VendorAdd  /></div>
    
		<div class="py-8 px-8 rounded-lg border-2 ">
			<div><p class="text-2xl font-bold pb-8">Contacts</p></div>
		<n-data-table class="rounded-lg"
			:columns="columns"
			:data="tableData"
			:pagination="pagination"
			:bordered="false"
		/>

		</div>
	</div>

      <n-drawer v-model:show="showOuterRef" :width="500">
    <n-drawer-content title="Vendor Details">
        <n-form
    :model="formValue"
    :label-width="90"
    size="medium"
    ref="formRef"
    >   
        <n-form-item label="First Name" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.first_name"
										:reset-value="formValue.first_name"
										:shouldUpdate="show.first_name"
										@revert="handleKeyDown('first_name')"
										@save="(val) => updateVendor('first_name', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.first_name"
                                            type="text"
											v-model:value="formValue.first_name"
											:loading="isLoading"
											@keyup="handleKeyUp('first_name')"
										/> </UpdatableButtonWrapper>
		</n-form-item>
        <n-form-item label="Last Name" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.last_name"
										:reset-value="formValue.last_name"
										:shouldUpdate="show.last_name"
										@revert="handleKeyDown('last_name')"
										@save="(val) => updateVendor('last_name', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.last_name"
                                            type="text"
											v-model:value="formValue.last_name"
											:loading="isLoading"
											@keyup="handleKeyUp('last_name')"
										/> </UpdatableButtonWrapper>
        </n-form-item>

        <n-form-item label="Email" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.email"
										:reset-value="formValue.email"
										:shouldUpdate="show.email"
										@revert="handleKeyDown('email')"
										@save="(val) => updateVendor('email', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.email"
                                            type="text"
                                            placeholder="Enter Email"
											v-model:value="formValue.email"
											:loading="isLoading"
											@keyup="handleKeyUp('email')"
										/> </UpdatableButtonWrapper>
        </n-form-item>

        <n-form-item label="Position" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.job_title"
										:reset-value="formValue.job_title"
										:shouldUpdate="show.job_title"
										@revert="handleKeyDown('job_title')"
										@save="(val) => updateVendor('job_title', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.job_title"
                                            type="text"
											v-model:value="formValue.job_title"
											:loading="isLoading"
                                            placeholder="Enter Job Title"
											@keyup="handleKeyUp('job_title')"
										/> </UpdatableButtonWrapper>
        </n-form-item>
       
        <n-form-item label="Cell Phone" class="pr-12">
									<updatable-button-wrapper
										v-model="formValue.cell_phone"
										:shouldUpdate="show.cell_phone"
										@revert="handleKeyDown('cell_phone')"
										:reset-value="formValue.cell_phone"
										@save="(val) => updateVendor('cell_phone', val)"
									>
										<masked-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.cell_phone"
											mask="(###) ###-####"
											:loading="isLoading"
											@keyup="handleKeyUp('cell_phone')"
											v-model:value="formValue.cell_phone"
										/>
									</updatable-button-wrapper>
		</n-form-item>

		<n-form-item label="Office Phone" class="pr-12">
									<updatable-button-wrapper
										v-model="formValue.office_phone"
										:shouldUpdate="show.office_phone"
										@revert="handleKeyDown('office_phone')"
										:reset-value="formValue.office_phone"
										@save="(val) => updateVendor('office_phone', val)"
									>
										<masked-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.office_phone"
											mask="(###) ###-####"
											:loading="isLoading"
											@keyup="handleKeyUp('office_phone')"
											v-model:value="formValue.office_phone"
										/>
									</updatable-button-wrapper>
		</n-form-item>
        
        
    </n-form>

    </n-drawer-content>
    
  </n-drawer>
</n-message-provider>
</template>

<script setup>
import { h, defineComponent, ref, watch, onUpdated } from 'vue'
import { useRoute } from "vue-router";
import { NTag, NButton, useMessage } from 'naive-ui'
import vendors from "@/api/vendors";
import MaskedInput from "@/components/common/MaskedInput.vue";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import VendorAdd from "@/components/vendor/VendorContactsAdd.vue";

const tableData = ref([]);
const showOuterRef = ref(false)
const route = useRoute();

const isLoading = ref(false)

const formValue = ref({
        vendor_id: 0,
        fullname: '',
        first_name: '',
        last_name: '',
        cell_phone: '',
        office_phone: '',
        email: '',
        job_title: '',
          
        })
const show = ref({

        first_name: false,
        last_name: false,
        cell_phone: false,
        office_phone: false,
        email: false,
        job_title: false,
          
        })

const routeParamId = ref(route.params?.id);    

const handleKeyUp = (val) => {
		show.value[val] = true;
	}

const handleKeyDown = (val) => {
		show.value[val] = false;
	}

watch(
		() => route.params?.id,
		
		() => {
			routeParamId.value = route.params?.id;
            vendors.retrieveContacts(routeParamId.value).then( res => { 
                if (res.data.length == 1) {
                    tableData.value = res.data;
                }
                else {
                    tableData.value = [];
                }
            
            })
			
		}
		
);

vendors.retrieveContacts(routeParamId.value).then( res => { 
                if (res.data.length == 1) {
                    tableData.value = res.data;
                }
                else {
                    tableData.value = [];
                }
            
            })

        
const doShowOuter = (row) => {

    formValue.value.vendor_id = row.id
    formValue.value.first_name = row.first_name
    formValue.value.last_name = row.last_name
    formValue.value.cell_phone = row.cell_phone
    formValue.value.office_phone = row.office_phone
    formValue.value.job_title = row.job_title
    formValue.value.email = row.email
    formValue.value.fax = row.fax

    showOuterRef.value = true;
    
}



function updateVendor(key, val){
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
		vendors.create(sendToAPI, 2).then((res) => {
			console.log("Vendor Updated Successfully");
			//isLoading.value = false;
			handleKeyDown(key)
			//debounceChange();
		});

    
}
        
const columns = [
                {
                    title: 'Name',
                    key: 'first_name',
                    //fixed: 'left'
                },
                {
                    title: 'Cell',
                    key: 'cell_phone',
                    //fixed: 'left'
                },
                {
                    title: 'Email',
                    key: 'email',
                    //fixed: 'left'
                },
                {
                    title: 'Position',
                    key: 'job_title',
                    //fixed: 'left'
                },
                {
                    title: "",
                    key: "edit",
                    render(row) {
                        return h(
                            NButton,
                            {
                                strong: true,
                                
                                size: "medium",
                                onClick: () => doShowOuter(row),
                            },
                            { default: () => "View / Edit" }
                        );
                    },
                },
     

            ]
const pagination = { pageSize: 10 }



       
    

</script>