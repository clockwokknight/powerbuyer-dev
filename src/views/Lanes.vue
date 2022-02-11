<template>

		<!-- Main Tabs App Content -->
		<div class="w-full h-screen">
			
			<!-- Main Body Content-->
			<div class="h-screen overflow-auto px-5 py-5 bg-white">
				<!-- Body Content -->
                <div class="mb-3"><h1 class="text-xl font-bold uppercase">Lane Numberings</h1></div>
                <n-space vertical :size="12">
                <n-space>
                <n-button @click="sortName">Sort By # </n-button>
                <n-button @click="filterAddress">Filter Location (Dallas)</n-button>
                <n-button @click="clearFilters">Clear Filters</n-button>
                <n-button @click="clearSorter">Clear Sorters</n-button>
                </n-space>
                <n-loading-bar-provider>
                        <n-data-table
                                ref="table"
                                :columns="columns"
                                :data="lanes"
                                :pagination="pagination"
                                :max-height="1000"
                                :scroll-x="1800"
                                :loading="loading"
                        />
                </n-loading-bar-provider>
                </n-space>
                    
                
			</div>
		</div>
	
</template>
<script>
	import { useRoute } from "vue-router";
	import { ref } from "vue";
    import lanes from "@/api/lanes";
    
	export default {
		data () {
			const route = useRoute();
			return {
				route,
                lanes: [],
				searchText: ref(""),
                columns: [
                {
                    title: '#',
                    key: 'id',
                    //fixed: 'left'
                },
                {
                    title: 'Ex',
                    key: 'age',
                    //fixed: 'left'
                },
                {
                    title: 'Sale Number',
                    key: 'address',
                    //fixed: 'left',
                    //width: 100,
                },
                {
                    title: 'VHR',
                    key: 'yellow_light',
                //fixed: 'left'
                },
                {
                    title: 'Year',
                    key: 'age',
                    fixed: 'left'
                },
                {
                    title: 'Make',
                    key: 'address'
                },
                {
                    title: 'Model',
                    key: 'name'
                },
                {
                    title: 'Body',
                    key: 'age'
                },
                {
                    title: 'Mileage',
                    key: 'address'
                },
                {
                    title: 'Lane #',
                    key: 'lane_number'
                },
                {
                    title: 'C. Cost',
                    key: 'floor_price'
                },
                {
                    title: 'Trade In',
                    key: 'address'
                },
                {
                    title: 'M. Ready',
                    key: 'name'
                },
                {
                    title: 'M. Price',
                    key: 'age'
                },
                {
                    title: 'Color',
                    key: 'address'
                },
                {
                    title: 'DOP',
                    key: 'name'
                },
                {
                    title: 'VIN',
                    key: 'age'
                },
                {
                    title: 'T',
                    key: 'address'
                },
                {
                    title: 'Dealer',
                    key: 'name'
                },
                {
                    title: 'Designation Code',
                    key: 'age'
                },
                {
                    title: 'Buyer Code',
                    key: 'address'
                },
                {
                    title: 'Grade',
                    key: 'age'
                },
                {
                    title: 'BCF',
                    key: 'address'
                },
                {
                    title: 'Car Notes',
                    key: 'name'
                },
                {
                    title: 'Inv. ID',
                    key: 'age'
                },
                {
                    title: 'Enable OVE',
                    key: 'address'
                },
                {
                    title: 'T. Notes',
                    key: 'notes'
                },
                {
                    title: 'W',
                    key: 'W'
                },
                {
                    title: 'V',
                    key: 'V'
                },
                ],
                loading: true,
                pagination: ref({ pageSize: 10 }),
                filterAddress () {
                    //dataTableInstRef.value.filter({
                    //address: ['Dallas']
                    //})
                },
                sortName () {
                    //dataTableInstRef.value.sort('name', 'ascend')
                },
                clearFilters () {
                    //dataTableInstRef.value.filter(null)
                },
                clearSorter () {
                    //dataTableInstRef.value.sort(null)
                },
                
                
			};
            
		},
        mounted() {
            this.getLanes();
        },
        created () {
           
        },
		components: {
			
		},
		computed: {

		},
		methods: {
            getLanes(){
                lanes.all().then( res => {
                console.log(res.data)
                this.lanes = res.data;
            }).finally(res =>{
                this.loading = false;
                console.log('done')
            })
            },
        
		},
	};
</script>