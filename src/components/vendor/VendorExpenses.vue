<template>
<div class="mt-4 px-4 font-sans antialiased">
		<div class="py-8 px-8 rounded-lg border-2 ">
			<div><p class="text-2xl font-bold pb-8">Expenses</p></div>
		<n-data-table class="rounded-lg"
			:columns="columns"
			:data="tableData"
			:pagination="pagination"
			:bordered="false"
		/>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import expenses from "@/api/expenses";


export default defineComponent({
    
    
    setup(){
        const tableData = ref([]);
        const columns = ref([]);
        
        console.log(expenses.all())
        expenses.all().then(({ data }) => (tableData.value = data, console.log(data)))
        
        
        
        return{
            columns: [
                {
                    title: 'Deal ID',
                    key: 'notes',
                    //fixed: 'left'
                },
                {
                    title: 'Name',
                    key: 'cost',
                    //fixed: 'left'
                },
                {
                    title: 'Description',
                    key: 'notes',
                    //fixed: 'left'
                },
                {
                    title: 'Amount',
                    key: 'cost',
                    //fixed: 'left'
                },
                {
                    title: 'Status',
                    key: 'notes',
                    //fixed: 'left'
                },
                {
                    title: 'DOS',
                    key: 'cost',
                    //fixed: 'left'
                },
                {
                    title: 'Inv #',
                    key: 'cost',
                    //fixed: 'left'
                },
            ],
            pagination: ref({ pageSize: 10 }),
            tableData
        }
    }
    
})
</script>