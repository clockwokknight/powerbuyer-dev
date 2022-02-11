<template>

<div content="Create New Vendor" v-tippy='{ placement : "right", duration: 50  }'>
<n-button @click="doShowOuter">
    <n-icon>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
    </n-icon>
</n-button>
</div>
  <n-drawer v-model:show="showOuter" :width="500">
    <n-drawer-content title="Add Vendor">
    <n-form
    :model="formValue"
    :label-width="90"
    :rules="rules"
    size="medium"
    ref="formRef"
    >   
       <n-form-item label="Company Name" path="fullname" class="pt-0">
        <n-input type="text" min-length="2" placeholder="Enter Name" clearable v-model:value.trim="formValue.fullname" />
        </n-form-item>
        <n-form-item label="DIN" path="din">
        <n-input type="text" min-length="2"  placeholder="Enter DIN" clearable v-model:value.trim="formValue.din" />
        </n-form-item>
        <n-form-item label="Payment Terms" path="paymentterms">
        <n-select
          placeholder="Select Payment Term"
          :options="paymenttermslist"
          v-model:value="formValue.paymentterms"
          filterable
        />
        </n-form-item>
        <n-form-item label="Vendor Category" path="vendorcategory">
        <n-select
          placeholder="Select Vendor Category"
          :options="vendorcategorylist"
          v-model:value="formValue.vendorcategory"
          filterable
        />
        </n-form-item>
        <n-form-item label="Tax ID" path="taxid">
        <n-input type="text" min-length="2"  placeholder="Enter Tax ID #" clearable v-model:value.trim="formValue.taxid" />
        </n-form-item>
        <n-form-item label="Address" path="address">
        <n-input type="text" min-length="2"  placeholder="Enter Address" clearable v-model:value.trim="formValue.address" />
        </n-form-item>
        <n-form-item label="Address Two" path="addresstwo">
        <n-input type="text" min-length="2"  placeholder="Enter Address Two" clearable v-model:value.trim="formValue.addresstwo" />
        </n-form-item>
        <n-form-item label="City" path="city">
        <n-input type="text" min-length="2"  placeholder="Enter City" clearable v-model:value.trim="formValue.city" />
        </n-form-item>
        <n-space>
        <n-form-item  label="State" path="state">
          
          <n-select style="width:220px;"
          placeholder="Select State"
          :options="statelist"
          v-model:value="formValue.state"
          filterable
          />

        </n-form-item>
        <n-form-item  label="ZIP Code" path="zip">
          <n-input type="text" min-length="2" maxlength="5" placeholder="Enter Zip" clearable v-model:value="formValue.zip" />
        </n-form-item>
        </n-space>
        <n-form-item label="Phone Number" path="phone">
        <masked-input mask="(###) ###-####"  placeholder="Enter Phone Number" clearable v-model:value="formValue.phone" />
        </n-form-item>
        <n-form-item  label="Email" path="email" required="true" 
          :feedback="feedback" :validation-status="success">
        <n-input  minlength="2" maxlength="64" :input-props="{ type: 'email' }" placeholder="Enter Email" pattern=".+@beststartupever\.com" clearable v-model:value="formValue.email" />
        </n-form-item>
        <n-form-item label="Fax" path="fax">
        <masked-input mask="(###) ###-####"  placeholder="Enter Fax #" clearable v-model:value.trim="formValue.fax" />
        </n-form-item>
        <n-form-item label="Comments" path="comments">
        <n-input type="textarea" show-count placeholder="Enter Comments" clearable v-model:value.trim="formValue.comments" />
        </n-form-item>
        <p>{{feedback}}</p>
    </n-form>
  
      <template #footer>
       <n-button size="large" @click="addVendor()" >Add</n-button>
      </template>
    </n-drawer-content>
    
  </n-drawer>
  
</template>


<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import vendors from "@/api/vendors";
import payments from "@/api/paymentterms";
import states from "@/api/states";
import { useMessage } from 'naive-ui'
import MaskedInput from "@/components/common/MaskedInput.vue";

export default defineComponent({
  setup () {
    const showOuterRef = ref(false)

    const formRef = ref(null)
    const message = useMessage()    

    const statelist = ref([]);
    
    const paymenttermslist = ref([]);

    const vendorcategorylist = ref([]);  

    let feedback = ref('')
    let status = ref('')
    
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
    function validateEmail(v){
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) {
          console.log('success')
          //this.msg['email'] = 'Please enter a valid email address';
      } else {
          console.log('nope')
          feedback = 'Please enter a valid email address.'
          status = 'error'
          //console.log('validate email plz')
          //this.msg['email'] = '';
      }
    } 
    function addVendor(){
      

      formRef.value.validate((errors) => {
        
      validateEmail(this.formValue.email)
          if (!errors) {

            if (this.formValue.vendorcategory == 'Service Provider'){ 
              var vendorid = 1 }
            else if (this.formValue.vendorcategory == 'Other'){ 
              var vendorid = 2 }
            else if (this.formValue.vendorcategory == 'Product Supplier'){ 
              var vendorid = 3 }


            const data = {
                name: this.formValue.fullname,
                tax_id_number: this.formValue.taxid,
                payment_terms: this.formValue.paymentterms,
                phone: this.formValue.phone,
                address_one: this.formValue.address,
                address_two: this.formValue.addresstwo || '',
                city: this.formValue.city,
                state: this.formValue.state,
                zip: this.formValue.zip,
                vendor_category_id: vendorid || 0,
                comments: this.formValue.comments || '',
                din: this.formValue.din,
                fax: this.formValue.fax || 0,
                email: this.formValue.email,
            }

            vendors.add(data).then( res => {                  
                    message.success("Successfully added vendor!")
                    showOuterRef.value = false;
                }).finally(res =>{
                    this.formValue.fullname= '',
                    this.formValue.taxid= '',
                    this.formValue.din= '',
                    this.formValue.address= '',
                    this.formValue.addresstwo= '',
                    this.formValue.paymentterms= '',
                    this.formValue.vendorcategory= '',
                    this.formValue.phone= '',
                    this.formValue.email= '',
                    this.formValue.state= '',
                    this.formValue.city= '',
                    this.formValue.zip= '',
                    this.formValue.fax= '',
                    this.formValue.comments= ''

                }).catch(err => {
                    console.log(err)
                    //message.warning("Error!")
                })
            
            //message.success('Valid')
          } else {
            console.log(errors)
            //validateEmail(this.formValue.email)
              }
            })
      

        //else error
    }
    
    return {
        formRef,
        formValue: ref({
          fullname: '',
          taxid: '',
          din: '',
          address: '',
          addresstwo: '',
          paymentterms: '',
          vendorcategory: '',
          phone: '',
          email: '',
          state: '',
          city: '',
          zip: '',
          fax: '',
          comments: '',
        }),

        statelist,
        paymenttermslist,
        vendorcategorylist,

        feedback,
        status,
        
        rules: {
          fullname: {
            required: true,
            message: 'Please enter a Company Name',
            trigger: ['input']
          },
          din: {
            required: true,
            message: 'Please enter a valid DIN',
            trigger: ['input']
          },
          paymentterms: {
            required: true,
            trigger: ['blur', 'change'],
            message: 'Please select a Payment Term'
          },
          vendorcategory: {
            required: true,
            message: 'Please select a vendor category',
            trigger: ['input']
          },
          taxid: {
            required: true,
            message: 'Please enter a valid Tax ID #',
            trigger: ['input']
          },
          address: {
            required: true,
            message: 'Please enter a valid Address',
            trigger: ['input']
          },
          email: {
            required: true,
            message: 'Please enter a valid Email Address',
            trigger: ['input']
          },
          state: {
            required: true,
            message: 'Please select a state',
            trigger: ['input']
          },
          city: {
            required: true,
            message: 'Please enter a City',
            trigger: ['input']
          },
          phone: {
            required: true,
            message: 'Please enter a phone number',
            trigger: ['input']
          },
          zip: {
            required: true,
            message: 'Please enter a Zip Code',
            trigger: ['input']
          },
        
        },
        addVendor,

        showOuter: showOuterRef,

        doShowOuter () {
            showOuterRef.value = true
        },

    }
    
  },
  
  components: {
			MaskedInput
		},
  methods: {
    
  },
  
})
</script>