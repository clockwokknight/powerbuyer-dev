<template>
<n-message-provider>
<div class="mt-4 px-4 font-sans antialiased">
    <div class="pb-4 justify-end"><VendorExpensesItemsAdd  /></div>
    
		<div class="py-8 px-8 rounded-lg border-2 ">
			<div><p class="text-2xl font-bold pb-8">Expense Items</p></div>
		<n-data-table class="rounded-lg"
			:columns="columns"
			:data="tableData"
			:pagination="pagination"
			:bordered="false"
		/>

		</div>
	</div>

      <n-drawer v-model:show="showOuterRef" :width="500">
    <n-drawer-content title="Expense Item Details">
        <n-form
    :model="formValue"
    :label-width="90"
    size="medium"
    ref="formRef"
    >   
        <n-form-item label="Name" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.name"
										:reset-value="formValue.name"
										:shouldUpdate="show.name"
										@revert="handleKeyDown('name')"
										@save="(val) => updateVendor('name', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.name"
                                            type="text"
											v-model:value="formValue.name"
											:loading="isLoading"
											@keyup="handleKeyUp('name')"
										/> </UpdatableButtonWrapper>
		</n-form-item>
        <n-form-item label="Description" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.description"
										:reset-value="formValue.description"
										:shouldUpdate="show.description"
										@revert="handleKeyDown('description')"
										@save="(val) => updateVendor('description', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.description"
                                            type="text"
											v-model:value="formValue.description"
											:loading="isLoading"
											@keyup="handleKeyUp('description')"
										/> </UpdatableButtonWrapper>
        </n-form-item>

        <n-form-item label="Type" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.expense_type_id"
										:reset-value="formValue.expense_type_id"
										:shouldUpdate="show.expense_type_id"
										@revert="handleKeyDown('expense_type_id')"
										@save="(val) => updateVendor('expense_type_id', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.expense_type_id"
                                            type="text"
                                            placeholder="Enter Type"
											v-model:value="formValue.expense_type_id"
											:loading="isLoading"
											@keyup="handleKeyUp('expense_type_id')"
										/> </UpdatableButtonWrapper>
        </n-form-item>

        <n-form-item label="Amount" class="pr-12">
									<UpdatableButtonWrapper
										v-model="formValue.amount"
										:reset-value="formValue.amount"
										:shouldUpdate="show.amount"
										@revert="handleKeyDown('amount')"
										@save="(val) => updateVendor('amount', val)"
									>
										<n-input style="width:400px;" class="border-2 rounded-md hover:border-sky-500 hover:ring-sky-500 hover:ring-0" 
											:default-value="formValue.amount"
                                            type="text"
											v-model:value="formValue.amount"
											:loading="isLoading"
                                            placeholder="Enter Amount"
											@keyup="handleKeyUp('amount')"
										/> </UpdatableButtonWrapper>
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
import expenses from "@/api/expenses";
import MaskedInput from "@/components/common/MaskedInput.vue";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import VendorExpensesItemsAdd from "@/components/vendor/VendorExpensesItemsAdd.vue";

const tableData = ref([]);
const showOuterRef = ref(false)
const route = useRoute();

const isLoading = ref(false)

const formValue = ref({
        vendor_id: 0,
        name: '',
		description: '',
		type: '',
		amount: ''
          
        })

const show = ref({
        name: false,
        description: false,
        type: false,
        amount: false,
          
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
            expenses.getItems(1).then( res => { 

                tableData.value = [res.data];
            
            })
			
		}
		
);
// this needs to pass vendor id.
expenses.getItems(1).then( res => { 
				console.log(res)
                tableData.value = [res.data];
            
            })

        
const doShowOuter = (row) => {
    console.log(row)
    console.log(formValue.value.name)
    console.log(row.name)
    formValue.value.vendor_id = row.vendor_id
    formValue.value.name = row.name
    formValue.value.description = row.description
    formValue.value.amount = row.amount
	formValue.value.expense_type_id = row.expense_type_id

    console.log(formValue.value)
    showOuterRef.value = true;
    
}



function updateVendor(key, val){
		console.log(key)
		console.log(val)
		const data = {
			[key]: formValue.value[key],
		};

		// console.log(sendToAPI);
		vendors.updateContacts(data, formValue.value.vendor_id).then((res) => {
			console.log("Vendor Updated Successfully");
			//isLoading.value = false;
			handleKeyDown(key)
			update.value++
			//debounceChange();
		}).finally((res) => {
			//console.log(update.value)
			vendors.retrieveContacts(routeParamId.value).then( res => { 
                if (res.data.length >= 1) {
                    tableData.value = res.data;
					
                }
                else {
                    tableData.value = [];
                }
            })
		});

    
}
        
const columns = [
                {
                    title: 'Name',
                    key: 'name',
                    //fixed: 'left'
                },
                {
                    title: 'Description',
                    key: 'description',
                    //fixed: 'left'
                },
                {
                    title: 'Expense Type',
                    key: 'expense_type_id',
                    //fixed: 'left'
                },
                {
                    title: 'Amount',
                    key: 'amount',
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