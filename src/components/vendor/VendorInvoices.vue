<template>
<div class="mt-4 px-4 font-sans antialiased">
		<div class="py-8 px-8 rounded-lg border-2 ">
			<div><p class="text-2xl font-bold pb-8">Invoices</p></div>
		<n-data-table
			:columns="columns"
			:data="invoicesData"
			:pagination="pagination"
			:bordered="false"
		/>
		</div>
	</div>
</template>
<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import expenses from "@/api/expenses";


export default defineComponent({
    
    
    setup(){
        
        const columns = ref([])
        
        return{
            columns: [
                {
                    title: 'Invoice',
                    key: 'notes',
                    //fixed: 'left'
                },
                {
                    title: 'Total',
                    key: 'cost',
                    //fixed: 'left'
                },
            ]
        }
    }
    
})
</script>