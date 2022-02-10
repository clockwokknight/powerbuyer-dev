<template>


<n-button @click="doShowOuter">
    <n-icon>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
    </n-icon>
</n-button>
  <n-drawer v-model:show="showOuter" :width="500">
    <n-drawer-content title="Add Vendor">
    <n-space vertical>
    <n-input type="text" min-length="2" size="large" placeholder="Name" clearable v-model:value.trim="fullname" />
    <n-input type="text" min-length="2" size="large" placeholder="Tax ID Number" clearable v-model:value.trim="taxid" />
    <n-input type="text" min-length="2" size="large" placeholder="Phone Number" clearable v-model:value.trim="phone" />
    <n-input type="text" min-length="2" size="large" placeholder="Address" clearable v-model:value.trim="address" />
    <n-input type="text" min-length="2" size="large" placeholder="City" clearable v-model:value.trim="city" />
    <n-input type="text" min-length="2" size="large" placeholder="State" clearable v-model:value.trim="state" />
    <n-input type="number" min-length="2" size="large" placeholder="Zip" clearable v-model:value="zip" />
  </n-space>
      <template #footer>
       <n-button size="large" @click="addVendor() && success()" >Add</n-button>
      </template>
    </n-drawer-content>
    
  </n-drawer>
</template>


<script>
import { defineComponent, ref } from 'vue'
import vendors from "@/api/vendors";
import { useMessage } from 'naive-ui'

export default defineComponent({
  setup () {
    const showOuterRef = ref(false)

    const message = useMessage()

    const fullname = ref('');
    const taxid = ref('');
    const phone = ref('');
    const address = ref('');
    const city = ref('');
    const state = ref('');
    const zip = ref('');

    function addVendor(){

        const data = {
            name: fullname.value,
            tax_id_number: taxid.value,
            phone: phone.value,
            address_one: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            vendor_category_id: 1,
        }
        
        vendors.add(data).then( res => {
                console.log(res)
                message.success("Success!")
                showOuterRef.value = false;
            }).finally(res =>{
                fullname.value = '',
                taxid.value = '',
                address.value = '',
                city.value = '',
                state.value = '',
                phone.value = '',
                zip.value = '';

            }).catch(err => {
                console.log(err)
                message.warning("Error!")
            })

        

        //else error
    }
    return {
        fullname,
        taxid,
        address,
        city,
        state,
        phone,
        zip,

        addVendor,
        showOuter: showOuterRef,

        doShowOuter () {
            showOuterRef.value = true
        },

    }
  },

  methods: {
    
  },
})
</script>